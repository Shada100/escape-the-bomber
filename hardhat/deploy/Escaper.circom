pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
template RangeProof(n) {
    assert(n <= 252);
    signal input in; // this is the number to be proved inside the range
    signal input range[2]; // the two elements should be the range, i.e. [lower bound, upper bound]
    signal output out;

    component low = LessEqThan(n);
    component high = GreaterEqThan(n);
    // Checking if it is less than the upper bound
    low.in[0] <== in;
    low.in[1] <== range[1];
    //checking if it is higher than the upperbound
    high.in[0] <== in;
    high.in[1] <== range[0];
    //this is like an And truth table will give an output of zero 
    //only if it is out of range and the other is true
    out <== (low.out) * (high.out);
}
template Ensureboardlimitandifbombed() {
    //public input 
    //escapers coordinate on the x axis 
    signal input escapersGuessX;
    //escapers coordinate on the y axis 
    signal input escapersGuessY;
     //private salt
    signal input privSalt;
    //bombers salted and hashed position 
    signal input hashedBomberXY;
    //private input
    //bombs coordinate on the x axis 
    signal input bombX;
    //bombs coordinate on the y axis
    signal input bombY;
    

     // Output
    signal output solnHashOut;
   


    var Ecoordinate[2] = [escapersGuessX, escapersGuessY];
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
    //checking if the escaper falls in between the bombers range
    component Rang[2];

    //checking the attackers x coordinate with the bombers x range 
    Rang[0] = RangeProof(5);
    Rang[0].in <==  Ecoordinate[0];
    Rang[0].range[0] <== bombX-1;
    Rang[0].range[1] <== bombX+1;
    //checking the attackers y coordinate with the bombers y range
    Rang[1] = RangeProof(5);
    Rang[1].in <==  Ecoordinate[1];
    Rang[1].range[0] <== bombY-1;
    Rang[1].range[1] <== bombY+1;

   Rang[0].out * Rang[1].out === 0;
   // if any gives an output of 0 the escaper wins cause the escaper is not within the bombers range of attack

     // Verify that the hash of the private solution matches pubSolnHash
    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <==  bombX;
    poseidon.inputs[2] <==  bombY;
    

    solnHashOut <== poseidon.out;
    hashedBomberXY === solnHashOut;
}
component main{public[escapersGuessX, escapersGuessY, hashedBomberXY]} =  Ensureboardlimitandifbombed();