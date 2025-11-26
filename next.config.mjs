// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   images: {
//     domains: [
//       "linkedupbyadrin.s3.ap-south-1.amazonaws.com",
//       "i.pravatar.cc",
//       "images.unsplash.com",
//       "localhost",
//     ],
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "https",
        hostname: "linkedupbyadrin.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
