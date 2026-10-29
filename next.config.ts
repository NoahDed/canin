import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers(){return [{source:"/(.*)",headers:[
    {key:"X-Content-Type-Options",value:"nosniff"},
    {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
    {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},
    {key:"X-Frame-Options",value:"SAMEORIGIN"},
    {key:"Strict-Transport-Security",value:"max-age=31536000; includeSubDomains"},
    {key:"Content-Security-Policy",value:"default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; frame-src 'none'"},
  ]}]},
};

export default nextConfig;
