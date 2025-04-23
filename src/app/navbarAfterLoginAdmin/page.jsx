// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';

// export default function navbarAfterLogin() {
//   return (
//     <nav className="bg-white py-4 shadow-md">
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         {/* Logo dan Teks Kotak Peduli */}
//         <Link href="/">
//           <div className="flex items-center space-x-2 cursor-pointer">
//             <Image
//               src="/Main Desain Skripsi Group 430.webp" // Pastikan path ke logo sesuai
//               alt="Kotak Peduli Logo"
//               width={40}
//               height={40}
//             />
//             <span className="font-bold text-[#4A2C2A] text-lg">Kotak Peduli</span>
//           </div>
//         </Link>

//         {/* Navigasi */}
//         <div className="hidden md:flex space-x-6">
//           <Link href="/about" className="text-[#4A2C2A] hover:text-amber-600 font-medium">
//             Barang Donasi
//           </Link>
//           <Link href="/tempatpenampung" className="text-[#4A2C2A] hover:text-amber-600 font-medium">
//             Event
//           </Link>
//           <Link href="/about" className="text-[#4A2C2A] hover:text-amber-600 font-medium">
//             Pos
//           </Link>
//           <Link href="/about" className="text-[#4A2C2A] hover:text-amber-600 font-medium">
//             Barang Donasi
//           </Link>
//           <Link href="/about" className="text-[#4A2C2A] hover:text-amber-600 font-medium">
//             Administrator
//           </Link>
//         </div>

//         {/* Tombol dan Ikon Profil */}
//         <div className="flex items-center space-x-4">
//           <Link href="/profile">    
//             <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#4A2C2A]">
//               <Image
//                 src="/Group 454 Figma.svg"
//                 alt="Profile Icon"
//                 width={38}
//                 height={38}
//               />
//             </div>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }