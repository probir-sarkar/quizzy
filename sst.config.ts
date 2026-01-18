// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "quizzy",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws"
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("MyBucket");

    new sst.aws.Function("MyFunction", {
      handler: "infra/lambda.handler",
      link: [bucket]
    });
  }
});
