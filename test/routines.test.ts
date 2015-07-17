/// <reference path="./../typings/tsd.d.ts" />
import {Routines, HashType} from './../src/routines';
import {BigInt} from './../node_modules/bigint.ts/bigint';
import {Hexadecimal} from './../node_modules/encode.ts/encode';



const I = 'alice';
const P = 'password123';
const s = new BigInt('beb25379d1a8581eb5a727673a2441ee', 16);
const N = new BigInt('eeaf0ab9adb38dd69c33f80afa8fc5e86072618775ff3c0b9ea2314c9c256576d674df7496ea81d3383b4813d692c6e0e0d5d8e250b98be48e495c1d6089dad15dc7d7b46154d6b6ce8ef4ad69b15d4982559b297bcf1885c529f566660e57ec68edbc3c05726cc02fd4cbf4976eaa9afd5138fe8376435b9fc61d2fc0eb06e3', 16);
const g = new BigInt('02', 16);
const k = new BigInt('7556aa045aef2cdd07abaf0f665c3e818913186f', 16);
const x = new BigInt('94b7555aabe9127cc58ccf4993db6cf84d16c124', 16);
const v = new BigInt('7e273de8696ffc4f4e337d05b4b375beb0dde1569e8fa00a9886d8129bada1f1822223ca1a605b530e379ba4729fdc59f105b4787e5186f5c671085a1447b52a48cf1970b4fb6f8400bbf4cebfbb168152e08ab5ea53d15c1aff87b2b9da6e04e058ad51cc72bfc9033b564e26480d78e955a5e29e7ab245db2be315e2099afb', 16);
const a = new BigInt('60975527035cf2ad1989806f0407210bc81edc04e2762a56afd529ddda2d4393', 16);
const b = new BigInt('e487cb59d31ac550471e81f00f6928e01dda08e974a004f49e61f5d105284d20', 16);
const A = new BigInt('61d5e490f6f1b79547b0704c436f523dd0e560f0c64115bb72557ec44352e8903211c04692272d8b2d1a5358a2cf1b6e0bfcf99f921530ec8e39356179eae45e42ba92aeaced825171e1e8b9af6d9c03e1327f44be087ef06530e69f66615261eef54073ca11cf5858f0edfdfe15efeab349ef5d76988a3672fac47b0769447b', 16);
const B = new BigInt('bd0c61512c692c0cb6d041fa01bb152d4916a1e77af46ae105393011baf38964dc46a0670dd125b95a981652236f99d9b681cbf87837ec996c6da04453728610d0c6ddb58b318885d7d82c7f8deb75ce7bd4fbaa37089e6f9c6059f388838e7a00030b331eb76840910440b1b27aaeaeeb4012b7d7665238a8e3fb004b117b58', 16);
const u = new BigInt('ce38b9593487da98554ed47d70a7ae5f462ef019', 16);
const S = new BigInt('b0dc82babcf30674ae450c0287745e7990a3381f63b387aaf271a10d233861e359b48220f7c4693c9ae12b0a6f67809f0876e2d013800d6c41bb59b6d5979b5c00a172b4a2a5903a0bdcaf8a709585eb2afafa8f3499b200210dcc1f10eb33943cd67fc88a2f39a4be5bec4ec0a3212dc346d7e474b29ede8a469ffeca686e5a', 16);


describe('Routines', () => {

  it('should compute x correctly', function() {
    var resultingX: BigInt = Routines.computeX(s, I, P, HashType.SHA1);
    expect(resultingX.toString(16)).toBe(x.toString(16));
  });

  it('should compute v correctly', function() {
    var resV: BigInt = Routines.computeV(N, g, x);
    expect(resV.toString(16)).toBe(v.toString(16));
  });

  it('should compute k correctly', function() {
    var resultingK: BigInt = Routines.compute_k(N, g, HashType.SHA1);
    expect(resultingK.toString(16)).toBe(k.toString(16));
  });

  it('should compute u correctly', function() {
    var resultingU: BigInt = Routines.computeU(A, B, N, HashType.SHA1);
    expect(resultingU.toString(16)).toBe(u.toString(16));
  });

  it('should compute A correctly', function() {
    var resultingA: BigInt = Routines.computeA(g, a, N);
    expect(resultingA.toString(16)).toBe(Hexadecimal.getString(A.getBytes()));
  });

  it('should compute B correctly', function() {
    var resultingB: BigInt = Routines.computeB(k, v, g, b, N);
    expect(resultingB.toString(16)).toBe(Hexadecimal.getString(B.getBytes()));
  });

  it('should compute Client Session Key', function() {
    var resultingKey: BigInt = Routines.computeClientSessionKey(N,  g,  k,  x,  u,  a, B);
    expect(resultingKey.toString(16)).toBe(Hexadecimal.getString(S.getBytes()));
  });

  it('should compute Server Session Key', function() {
    var resultingKey: BigInt = Routines.computeServerSessionKey(N, v,  u,  A, b);
    expect(resultingKey.toString(16)).toBe(S.toString(16));
  });

  it('should generate a random number at least 256 bits in length', function() {
    var result: BigInt = Routines.generate_a();
    expect(result.getBytes().byteLength).toBeGreaterThan((256 / 8) - 1);
  });

  it('should generate a correct M1', function() {
    var K = Routines.computeK(S);
    var result: string = Routines.generateM1(N, g, I, s,  A,  B,  K,  HashType.SHA1);
    expect(result).toBe("3f3bc67169ea71302599cf1b0f5d408b7b65d347");
  });

  it('should generate a correct M2', function() {
    var K = Routines.computeK(S);

    var result: string = Routines.generateM2(A, new BigInt("3f3bc67169ea71302599cf1b0f5d408b7b65d347", 16), K,  HashType.SHA1);
    expect(result).toBe("9cab3c575a11de37d3ac1421a9f009236a48eb55");
  });


});
