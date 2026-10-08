declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    TESSAPAY_SMS_TOKEN?: string;
    BUCKET?: R2Bucket;
  }
}
