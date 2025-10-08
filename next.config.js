/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENSEARCH_HOST: process.env.OPENSEARCH_HOST,
    OPENSEARCH_USERNAME: process.env.OPENSEARCH_USERNAME,
    OPENSEARCH_PASSWORD: process.env.OPENSEARCH_PASSWORD,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  },
}

module.exports = nextConfig
