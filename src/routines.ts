import {BigInt} from './../node_modules/bigint.ts/bigint';
import {UTF8, Hexadecimal, ByteArray} from './../node_modules/encode.ts/encode';
import {Hash, HashType} from './../node_modules/hash.ts/hash';

export {HashType} from './../node_modules/hash.ts/hash';
export {BigInt} from './../node_modules/bigint.ts/bigint';



export class Routines {


  /**
   * x contains the user's password mixed with a salt.
   */
  public static computeX(s: BigInt, I: string, P: string, hashType?: HashType) : BigInt {
    var here = UTF8.getBytes(`${I}:${P}`);
    var id = Hexadecimal.getBytes(Routines.hashString(here));
    var salt  = Hexadecimal.getBytes(s.toString(16));
    var total = ByteArray.concat(salt, id);

    return new BigInt(Routines.hashString(total, hashType), 16);
  }


  /**
   * The private values for a and b correspond roughly to the private
   * values in a Diffie-Hellman exchange and have similar constraints of
   * length and entropy.  Implementations may choose to increase the
   * length of the parameter u, as long as both client and server agree,
   * but it is not recommended that it be shorter than 32 bits.
   *
   * MUST NOT BE REVEALED
   * *******where a is a random number that SHOULD be at least 256 bits in length.
   */
  public static generate_a(): BigInt {

    return this.generateRandom(32);
  }


  /**
   *
   */
  public static generateSalt(bits: number = 160): ArrayBufferView {

    return window['crypto'].getRandomValues(new Uint8Array(bits / 8));
  }


  /**
   *
   */
  private static generateRandom(num) : BigInt {
    if(typeof window.crypto === 'object') {
      var bytes = new Uint8Array(num);
      window.crypto.getRandomValues(bytes);

      return new BigInt(Hexadecimal.getString(bytes), 16);
    } else {
      throw new Error('No Crypto');
    }
  }


  /**
   * u prevents an attacker who learns a user's verifier from being
   * able to authenticate as that user (see [SRP-6]).
   */
  public static computeU(A: BigInt, B: BigInt, N: BigInt, hashType?: HashType): BigInt {

    var n = N.getBytes();
    var a = ByteArray.pad(A.getBytes(), n.length);
    var b = ByteArray.pad(B.getBytes(), n.length);
    var ab = ByteArray.concat(a, b);

    return new BigInt(Routines.hashString(ab, hashType), 16);
  }


  /**
   * k prevents an attacker who can select group parameters from being
   * able to launch a 2-for-1 guessing attack (see [SRP-6]).
   *
   * SRP-6 multiplier
   */
  public static compute_k(N: BigInt, g: BigInt, hashType?: HashType): BigInt {
    var N2 = N.getBytes();
    var g2 = g.getBytes();
    var p2Pad = ByteArray.pad(g2, N2.length);
    var final = ByteArray.concat(N2, p2Pad);

    return new BigInt(Routines.hashString(final, hashType), 16);
  }


  /**
   * verifier
   */
  public static computeV(N: BigInt, g: BigInt, x: BigInt): BigInt {

    return g.modPow(x, N);
  }


  /**
   *
   */
  public static computeB(k: BigInt, v: BigInt, g: BigInt, b:BigInt, N: BigInt): BigInt {

    return g.modPow(b, N).add(v.multiply(k)).mod(N);
  }


  /**
   *
   */
  public static computeA(g: BigInt, a: BigInt, N: BigInt): BigInt {

    return g.modPow(a, N);
  }


  /**
   * Creates the client's pre master key.
   */
  public static computeClientSessionKey(N: BigInt,
                                        g: BigInt,
                                        k: BigInt,
                                        x: BigInt,
                                        u: BigInt,
                                        a: BigInt,
                                        B: BigInt): BigInt {
    //          4             3
    //            1               2
    // (B - (k * g^x)) ^ (a + (u * x)) % N
    var gx = g.modPow(x, N);
    var kgx = gx.multiply(k);
    var Bkgx = B.subtract(kgx);
    var ux = u.multiply(x);
    var aux = ux.add(a);

    return  Bkgx.modPow(aux,  N);
  }


  /**
   * Creates the servers session key. This is pretty useless on the client.
   */
  public static computeServerSessionKey(N: BigInt,
                                         v: BigInt,
                                         u: BigInt,
                                         A: BigInt,
                                         b: BigInt): BigInt {

    return v.modPow(u, N).multiply(A).modPow(b, N);
  }


  /**
   * Creates the clients shared session key
   */
  public static computeK(S: BigInt, hash?: HashType): BigInt {

    return new BigInt(Routines.hashString(S.getBytes(), hash), 16);
  }


  /**
   * Creates the clients evidence.
   */
  public static generateM1(N: BigInt,
                           g: BigInt,
                           I: string,
                           s: BigInt,
                           A: BigInt,
                           B: BigInt,
                           K: BigInt,
                           hash?: HashType): string {

    var hashN = Routines.hashBigInt(N.getBytes());
    var hashG = Routines.hashBigInt(g.getBytes());
    var xor = hashN.xor(hashG).getBytes();
    var hashI = Routines.hash(UTF8.getBytes(I));
    var total = ByteArray.concat(xor, hashI, s.getBytes(), A.getBytes(), B.getBytes(), K.getBytes());

    return Routines.hashString(total, hash);
  }


  /**
   * Creates the servers evidence.
   */
  public static generateM2(A: BigInt,  M1:BigInt,  K: BigInt, hash?: HashType):string {
    var total = ByteArray.concat(A.getBytes(), M1.getBytes(), K.getBytes());

    return Routines.hashString(total, hash);
  }


  /**
   * Verifies that the servers evidence matches
   */
  public static verifyM2(M2: string, A: BigInt, M1: string, K: BigInt, hash?: HashType) : boolean {

    return M2 === Routines.generateM2(A, new BigInt(M1, 16), K, hash);
  }


  /**
   * This is pretty pointless here, we don't need to verify M1 on the client
   */
  public static verifyM1(M1: string,
                          N: BigInt,
                          g: BigInt,
                          I: string,
                          s: BigInt,
                          A: BigInt,
                          B: BigInt,
                          K: BigInt,
                          hash?: HashType): boolean {

    return M1 === Routines.generateM1(N, g, I, s, A, B, K, hash);
  }


  /**
   * Hash an array of data.
   */
  private static hash(data: Uint8Array, hash: HashType = HashType.SHA1): Uint8Array {

    return Hash.createHash(data, hash);
  }


  /**
   *
   */
  private static hashString(data: Uint8Array, hash?: HashType): string {

    return Hexadecimal.getString((Routines.hash(data, hash)));
  }


  /**
   *
   */
  private static hashBigInt(data: Uint8Array, hash?: HashType): BigInt {

    return new BigInt(Routines.hashString(data, hash), 16);
  }

}
