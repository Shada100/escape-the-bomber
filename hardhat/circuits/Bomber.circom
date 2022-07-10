pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";

template Ensureboardlimitandifbombed() {
    //private input 
    //escapers coordinate on the x axis 
    signal input escapersX;
    //escapers coordinate on the y axis 
    signal input escapersY;
     //private salt
    signal input privSalt;
     //public input
    //bombers salted and hashed position 
    signal input hashedEscaperXY;
    //bombs coordinate on the x axis 
    signal input bombX;
    //bombs coordinate on the y axis
    signal input bombY;
   

     // Output
    signal output solnHashOut;
   


    var Ecoordinate[2] = [escapersX, escapersY];
    var Bcoordinate[2] = [bombX, bombY];
    component lessThan[4];

    //Creating a constraint that the x and y position chosen by
    // the bomber and escaper to ensure is on the board
    for(var i = 0; i < 2; i++){
        lessThan[i] = LessThan(3);
        lessThan[i].in[0] <== Ecoordinate[i];
        lessThan[i].in[1] <== 6;
        lessThan[i].out === 1;
        lessThan[i+2] = LessThan(3);
        lessThan[i+2].in[0] <== Bcoordinate[i];
        lessThan[i+2].in[1] <== 6;
        lessThan[i+2].out === 1;
    }

 component equalCoord[2];
    for(var i = 0; i < 2; i++){
        equalCoord[i] = IsEqual();
        equalCoord[i].in[0] <== Ecoordinate[i];
        equalCoord[i].in[1] <== Bcoordinate[i];
       }
        equalCoord[0].out * equalCoord[1].out === 0;
   
    // Verify that the hash of the private solution matches pubSolnHash
    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <==  escapersX;
    poseidon.inputs[2] <==  escapersY;
    

    solnHashOut <== poseidon.out;
    hashedEscaperXY === solnHashOut;
 }

component main{public[bombX, bombY, hashedEscaperXY]} =  Ensureboardlimitandifbombed();