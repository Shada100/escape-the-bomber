import { expect } from "chai";
import {
  Contract,
  ContractFactory,
  Signer,
  constants,
  BigNumber,
  ContractTransaction,
  ContractReceipt,
} from "ethers";
import { ethers } from "hardhat";
const snarkjs = require("snarkjs");

describe("BombEscaper", function () {
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    let verifierContract = await ethers.getContractFactory("Verifier");
    let verifier = await verifierContract.deploy();
    await verifier.deployed();
    BombEscaperContract = await ethers.getContractFactory("BombEscaper");
    BombEscaper = await BombEscaperContract.deploy(verifier.address);
    await BombEscaper.deployed();

    expect(await BombEscaper.lastBattleId()).to.equal(0);
  });

  describe("Chess Piece", function () {
    it("Should be able to add new chess piece", async () => {
      BombEscaper.setChessPiece(
        1,
        ethers.utils.formatBytes32String("Fighter"),
        4,
        1,
        1
      );
      const newChessPiece = await BombEscaper.getChessPiece(1);
      expect(ethers.utils.parseBytes32String(newChessPiece.name)).to.equal(
        "Fighter"
      );
    });

    it("Should only allow owner to set chess piece", async function () {
      await expect(
        BombEscaper.connect(addr1).setChessPiece(
          1,
          ethers.utils.formatBytes32String("Fighter"),
          4,
          1,
          1
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Create and Join Battle", function () {
    it("Should be able to create a battle", async function () {
      await BombEscaper.createBattle();
      const battle = await BombEscaper.getBattle(1);

      expect(battle["playerA"]).to.equal(await owner.getAddress());
      expect(battle["playerB"]).to.equal(constants.AddressZero);
      expect(battle["canJoin"]).to.equal(true);
    });

    it("Should be able to create battle by other address", async function () {
      await BombEscaper.connect(addr1).createBattle();

      const battle = await BombEscaper.getBattle(1);
      expect(battle["playerA"]).to.equal(await addr1.getAddress());
      expect(battle["playerB"]).to.equal(constants.AddressZero);
      expect(battle["canJoin"]).to.equal(true);
    });

    it("Should be able to join battle from other address", async function () {
      await BombEscaper.createBattle();
      await BombEscaper.connect(addr1).joinBattle(1);

      const battle = await BombEscaper.getBattle(1);
      expect(battle["playerA"]).to.equal(await owner.getAddress());
      expect(battle["playerB"]).to.equal(await addr1.getAddress());
      expect(battle["canJoin"]).to.equal(false);
    });

    it("Should reject player to re-join a battle", async function () {
      await BombEscaper.createBattle();
      await expect(BombEscaper.joinBattle(1)).to.be.revertedWith(
        "Player already in this Battle"
      );
    });

    it("Should reject player to join if battle is full", async function () {
      await BombEscaper.createBattle();
      await BombEscaper.connect(addr1).joinBattle(1);
      await expect(BombEscaper.connect(addr2).joinBattle(1)).to.be.revertedWith(
        "Battle is full"
      );
    });
  });

  describe("Core Game", function () {
    const valid_input_A = {
      playfield: [3, 0, 0, 0, 2, 0, 3, 0],
      salt: 185234789123,
    };

    const valid_input_B = {
      playfield: [2, 2, 2, 0, 2, 0, 0, 0],
      salt: 185234789123,
    };

    const invalid_input = {
      playfield: [0, 3, 0, 0, 2, 0, 3, 0],
      salt: 185234789123,
    };

    it("Should let player deploy move", async function () {
      await BombEscaper.createBattle();
      await BombEscaper.connect(addr1).joinBattle(1);
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        valid_input_A,
        "./circuits/BombEscaper_js/BombEscaper.wasm",
        "./circuits/BombEscaper_0001.zkey"
      );
      let battle = await BombEscaper.getBattle(1);

      await BombEscaper.deploy(1, publicSignals[0]);
      expect(battle["canReveal"]).to.be.false;

      await BombEscaper.connect(addr1).deploy(1, publicSignals[0]);
      battle = await BombEscaper.getBattle(1);
      expect(battle["canReveal"]).to.be.true;
    });

    it("Should not let player re-deploy move", async function () {
      await BombEscaper.createBattle();
      await BombEscaper.connect(addr1).joinBattle(1);
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        valid_input_A,
        "./circuits/BombEscaper_js/BombEscaper.wasm",
        "./circuits/BombEscaper_0001.zkey"
      );
      let battle = await BombEscaper.getBattle(1);

      await BombEscaper.deploy(1, publicSignals[0]);
      expect(battle["canReveal"]).to.be.false;

      await expect(BombEscaper.deploy(1, publicSignals[0])).to.be.revertedWith(
        "Player already deployed move"
      );
    });

    it("Shoud let player check opponent move", async function () {
      await BombEscaper.createBattle();
      await BombEscaper.connect(addr1).joinBattle(1);
      const playerAProof = await snarkjs.groth16.fullProve(
        valid_input_A,
        "./circuits/BombEscaper_js/BombEscaper.wasm",
        "./circuits/BombEscaper_0001.zkey"
      );
      let battle = await BombEscaper.getBattle(1);

      await BombEscaper.deploy(1, playerAProof.publicSignals[0]);
      expect(battle["canReveal"]).to.be.false;

      const playerBProof = await snarkjs.groth16.fullProve(
        valid_input_B,
        "./circuits/BombEscaper_js/BombEscaper.wasm",
        "./circuits/BombEscaper_0001.zkey"
      );
      await BombEscaper.connect(addr1).deploy(1, playerBProof.publicSignals[0]);
      battle = await BombEscaper.getBattle(1);
      expect(battle["canReveal"]).to.be.true;

      const argv = [
        playerBProof.proof["pi_a"][0],
        playerBProof.proof["pi_a"][1],
        playerBProof.proof["pi_b"][0][1],
        playerBProof.proof["pi_b"][0][0],
        playerBProof.proof["pi_b"][1][1],
        playerBProof.proof["pi_b"][1][0],
        playerBProof.proof["pi_c"][0],
        playerBProof.proof["pi_c"][1],
      ];

      const a = [argv[0], argv[1]];
      const b = [
        [argv[2], argv[3]],
        [argv[4], argv[5]],
      ];
      const c = [argv[6], argv[7]];
      const field = playerBProof.publicSignals.slice(1, 9);
      const salt = playerBProof.publicSignals[9];

      await BombEscaper.connect(addr1).reveal(1, field, salt, a, b, c);
      const playerBState = await BombEscaper.getBattlePlayerState(
        1,
        await addr1.getAddress()
      );
      expect(
        playerBState.field.map((x) => {
          return x.toString();
        })
      ).to.have.members(field);
      expect(playerBState.salt).to.be.equal(salt);
    });

    it("Should let player reveal move", async function () {
      await BombEscaper.createBattle();
      await BombEscaper.connect(addr1).joinBattle(1);

      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        valid_input_A,
        "./circuits/BombEscaper_js/BombEscaper.wasm",
        "./circuits/BombEscaper_0001.zkey"
      );

      await BombEscaper.deploy(1, publicSignals[0]);
      await BombEscaper.connect(addr1).deploy(1, publicSignals[0]);

      const argv = [
        proof["pi_a"][0],
        proof["pi_a"][1],
        proof["pi_b"][0][1],
        proof["pi_b"][0][0],
        proof["pi_b"][1][1],
        proof["pi_b"][1][0],
        proof["pi_c"][0],
        proof["pi_c"][1],
      ];

      const a = [argv[0], argv[1]];
      const b = [
        [argv[2], argv[3]],
        [argv[4], argv[5]],
      ];
      const c = [argv[6], argv[7]];
      const field = publicSignals.slice(1, 9);
      const salt = publicSignals[9];
      await BombEscaper.reveal(1, field, salt, a, b, c);
      await BombEscaper.connect(addr1).reveal(1, field, salt, a, b, c);
    });
  });
});
