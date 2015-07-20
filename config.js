System.config({
  "transpiler": "traceur",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "bigint.ts": "github:jamcoupe/bigint.ts@master",
    "encode.ts": "github:jamcoupe/encode.ts@master",
    "hash.ts": "github:jamcoupe/hash.ts@master",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "github:jamcoupe/encode.ts@master": {
      "jamcoupe/base64-js": "github:jamcoupe/base64-js@master"
    },
    "github:jamcoupe/hash.ts@master": {
      "encode.ts": "github:jamcoupe/encode.ts@master",
      "fast-sha256-js": "github:jamcoupe/fast-sha256-js@master",
      "rusha": "github:jamcoupe/rusha@master"
    }
  }
});

