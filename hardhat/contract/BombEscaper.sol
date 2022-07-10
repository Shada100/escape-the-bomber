// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import "./node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BombEscaper
 * @dev On-chain auto  battle game
 */

interface IHasher {
    function poseidon(uint256[3] calldata inputs)
        external
        pure
        returns (uint256);
}


interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[4] memory input
    ) external view returns (bool);
}

contract BombEscaper is Ownable {
    address verifierContract;
     address hasher;

    enum BattleEventType {
        Create,
        Join,
        Result
    }

    event BattleLog(
        uint256 battleId,
        BattleEventType eventType,
        address account
    );

     event Reveal(address indexed player, uint256 battleId,  uint8 a, uint8 b);

    /**
     * @dev  BombPiece structure and mapping defintion
     */
    

  

    struct EscaperProof {
        uint256 CoordinateHash;
        uint256[2] Ecoordinate;
        uint256[2] Bcoordinate;
        uint256 salt;
        uint256 Escore;
        }

    struct Battle {
        address Escaper;
        address Bomber;
        bool canJoin;
        bool canSubmit;
        bool canReveal;
        address winner;
    }

    uint256 public lastBattleId;
    mapping(uint256 => Battle) public battles;
    mapping(uint256 => EscaperProof) public escaperProof;
    mapping(address => uint256[]) public playerBattleIds;

    modifier battleReadyToStart(uint256 battleId) {
        require(battleId <= lastBattleId, "Battle does not exist");
        require(battles[battleId].Escaper != address(0), "PlayerB is missing");
        _;
    }

    modifier onlyBomberOfBattle(uint256 battleId) {
        require(
            msg.sender == battles[battleId].Bomber,
            "Only Bomber of battle allowed"
        );
        _;
    }

     modifier onlyEscaperOfBattle(uint256 battleId) {
        require(
            msg.sender == battles[battleId].Escaper,
            "Only Escaper of battle allowed"
        );
        _;
    }

     modifier onlyPlayersOfBattle(uint256 battleId) {
        require(
            msg.sender == battles[battleId].Bomber ||
                msg.sender == battles[battleId].Escaper,
            "Only players of battle allowed"
        );
        _;
    }

    constructor(address _verifier, address _hasher) {
        verifierContract = _verifier;
        hasher = _hasher;
    }

    /**
     * @dev Set new  piece
     * @dev Update if PieceId already exists
     * @param Xcoordinate  piece Xcoordinate
     * @param Ycoordinate  piece Ycoordinate
     */
    // function setBombPiece(
    //     uint256 battleId,
    //     uint256 Xcoordinate,
    //     uint256 Ycoordinate
    // ) public onlyBomberOfBattle(battleId) {
    //     require(BombUsage != 0, "Bomb all used up");
    //     BombPiece( Xcoordinate, Ycoordinate);
    //     BombUsage--;
    // }

  //   function setescaperProof(
  //      uint256 battleId,
  //      uint256 CoordinateHash,
  //      uint256 Xcoordinate,
  //      uint256 Ycoordinate,
  //      uint256 salt
  //  ) public onlyEscaperOfBattle(battleId) {
  //   escaperProof[battleId] = EscaperProof( CoordinateHash,[ Xcoordinate, Ycoordinate], salt);
  //     }
    

    /**
     * @dev Get information of  piece
     * @param PieceId targeted PieceId
     * @return BombPiece
     */
    //function getPiece(uint256 PieceId)
    //    public
    //    view
    //    returns (BombPiece memory)
    //{
    //    return Pieces[PieceId];
    //}

    /**
     * @dev Call by player to deploy their move
     * @param battleId targeted battle
     * @param hash of player move
     */
    function deploy(uint256 battleId, uint256 hash)
        public
        battleReadyToStart(battleId)
        onlyEscaperOfBattle(battleId)
    {
        require(
            escaperProof[battleId].CoordinateHash == 0,
            "Player already deployed move"
        );
        escaperProof[battleId].CoordinateHash = hash;

        if (
            escaperProof[battleId].CoordinateHash !=
            0
        ) {
            battles[battleId].canSubmit = true;
        }
    }

    /**
     * @dev Call by player to reveal their move
     * @param battleId targeted battle
     * @param input player's input
     */
    function submitProof(
        uint256 battleId,
        uint256[4] calldata input,
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c
    ) public battleReadyToStart(battleId)  onlyEscaperOfBattle(battleId) {
        require(battles[battleId].canSubmit, "Battle not ready for proof submission");
        uint256[4] memory verifierInput;
        verifierInput[0] = escaperProof[battleId].CoordinateHash;
        for (uint256 i = 0; i < input.length; i++) {
            verifierInput[i + 1] = input[i];
        }
       if (IVerifier(verifierContract).verifyProof(a, b, c, verifierInput)) {
            escaperProof[battleId].Escore++ ;
              if(escaperProof[battleId].Escore == 6){
             battles[battleId].winner = battles[battleId].Escaper;
        }
           
        } else if(!IVerifier(verifierContract).verifyProof(a, b, c, verifierInput)) {
             battles[battleId].winner = battles[battleId].Bomber;
             battles[battleId].canReveal = true;
        }
          escaperProof[battleId].Bcoordinate[0] = input[0];
          escaperProof[battleId].Bcoordinate[1] = input[1];
          escaperProof[battleId].CoordinateHash = input[2];
    }

      
     function reveal(
        uint256 salt,
        uint256 battleId,
        uint8 a,
        uint8 b
    ) public  {
        require(battles[battleId].canReveal, "Battle not ready for reveal");
        // Check the hash to ensure the solution is correct
        require(
        IHasher(hasher).poseidon([salt, a, b]) == escaperProof[battleId].CoordinateHash,
            "invalid hash"
        );

        emit Reveal(msg.sender, battleId, a, b);
    }

    /**
     * @dev Create a new battle
     */
    function createBattle() public returns (uint256) {
        lastBattleId++;
        battles[lastBattleId] = Battle(
            msg.sender,
            address(0),
            true,
            false,
            false,
            address(0)
        );
        playerBattleIds[msg.sender].push(lastBattleId);
        emit BattleLog(lastBattleId, BattleEventType.Create, msg.sender);
        return lastBattleId;
       }

    /**
     * @dev Join a battle
     * @param battleId targeted battleId
     */
    function joinBattle(uint256 battleId) public {
        require(battleId <= lastBattleId, "Battle does not exist");
        require(battles[battleId].canJoin, "Battle is full");
        require(
            msg.sender != battles[battleId].Bomber,
            "Player already in this Battle"
        );
        battles[battleId].canJoin = false;
        playerBattleIds[msg.sender].push(lastBattleId);
        battles[battleId].Escaper = msg.sender;
        emit BattleLog(lastBattleId, BattleEventType.Join, msg.sender);
    }

    /**
     * @dev Get information of a battle
     * @param battleId targeted battleId
     */
    function getBattle(uint256 battleId) public view returns (Battle memory) {
        require(battleId <= lastBattleId, "Battle does not exist");
        return battles[battleId];
    }

    /**
     * @dev Get player information of a battle
     * @param battleId targeted battleId
     * 
     */
    function getescaperProof(uint256 battleId)
        public
        view
        returns (EscaperProof memory)
    {
        require(battleId <= lastBattleId, "Battle does not exist");
        return escaperProof[battleId];
    }

    /**
     * @dev Get information of a battle
     */
    function getPlayerBattles() public view returns (uint256[] memory) {
        return playerBattleIds[msg.sender];
    }
}