// 'use client'

// // pages/register.js
// import { useState } from "react";
// import Image from "next/image";
// import Head from "next/head";
// import { FcGoogle } from "react-icons/fc"; 



// export default function Register() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // Handle form submission logic here
//   };

//   return (
//     <div className="min-h-screen bg-white flex">
//       <Head>
//         <title>Beri Barang - Daftar</title>
//         <meta
//           name="description"
//           content="Beri Barang donation registration page"
//         />
//       </Head>

//       {/* Container */}
//       <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
//         {/* Logo */}
//         <div className="absolute top-8 left-8">
//           <div className="flex items-center">
//             <div className="h-10 w-10">
//               <Image
//                 src="/logo.png"
//                 alt="Beri Barang Logo"
//                 width={50}
//                 height={50}
//                 className="object-contain"
//               />
//             </div>
//             <span className="ml-2 text-amber-800 font-bold text-xl">
//               Beri Barang
//             </span>
//           </div>
//         </div>

//         {/* Left Side - Illustration */}
//         <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
//           <div className="bg-amber-50 rounded-lg p-8 max-w-md">
//             <div className="relative">
//               <Image
//                 src="/donation-illustration.png"
//                 alt="Donation Illustration"
//                 width={400}
//                 height={400}
//                 className="object-contain"
//               />
//               <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-lg border-2 border-amber-400">
//                 <p className="text-amber-800 font-bold">YUK, DONASI!</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Registration Form */}
//         <div className="w-full md:w-1/2 md:pl-12">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">DAFTAR</h1>
//           <p className="text-gray-700 mb-6">
//             Bersama menyejahterakan masyarakat
//           </p>

//           <form onSubmit={handleSubmit}>
//             {/* First and Last Name */}
//             <div className="flex gap-4 mb-4">
//               <div className="w-1/2">
//                 <label
//                   htmlFor="firstName"
//                   className="block text-gray-700 font-medium mb-1"
//                 >
//                   Nama Depan
//                 </label>
//                 <input
//                   type="text"
//                   id="firstName"
//                   name="firstName"
//                   placeholder="Matthew"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label
//                   htmlFor="lastName"
//                   className="block text-gray-700 font-medium mb-1"
//                 >
//                   Nama Depan
//                 </label>
//                 <input
//                   type="text"
//                   id="lastName"
//                   name="lastName"
//                   placeholder="Emmanuel"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div className="mb-4">
//               <label
//                 htmlFor="phone"
//                 className="block text-gray-700 font-medium mb-1"
//               >
//                 Nomor Telepon (Whatsapp)
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 placeholder="081246875123"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-gray-700 font-medium mb-1"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="example@email.com"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div className="mb-6">
//               <label
//                 htmlFor="password"
//                 className="block text-gray-700 font-medium mb-1"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="Masukkan minimum 8 karakter"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                 value={formData.password}
//                 onChange={handleChange}
//                 minLength={8}
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-medium rounded-md transition duration-200"
//             >
//               Buat Akun
//             </button>

//             {/* Divider */}
//             <div className="flex items-center my-6">
//               <div className="flex-grow border-t border-gray-300"></div>
//               <span className="px-3 text-gray-500 text-sm">
//                 atau menggunakan
//               </span>
//               <div className="flex-grow border-t border-gray-300"></div>
//             </div>

//             {/* Google Sign Up */}
//             <button
//               type="button"
//               className="w-full py-3 border border-gray-300 flex justify-center items-center gap-2 rounded-md hover:bg-gray-50 transition duration-200"
//             >
//               <FcGoogle size={20} /> 
//               <span>Google</span>
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client'

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Head from "next/head";
// import { FcGoogle } from "react-icons/fc"; 
// import { useRouter } from 'next/navigation';
// import {
//   registerWithEmail,
//   loginWithGoogle,
//   onAuthStateChange,
// } from '../auth/auth';  

// export default function Registration() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState('');
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // //Check auth state and redirect if logged in
//   // useEffect(() => {
//   //   const unsubscribe = onAuthStateChange((currentUser) => {
//   //     setUser(currentUser);
//   //     if (currentUser) {
//   //       router.push('/homepage'); // Redirect to homepage after successful login
//   //     }
//   //   });

//   //   return () => unsubscribe();
//   // }, [router]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChange((currentUser) => {
//       setUser(currentUser);
//       // Remove automatic redirect; let the user stay on the page
//     });

//     return () => unsubscribe();
//   }, []);

//   // Handle form submission for email/password registration
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await registerWithEmail(formData.email, formData.password);
//       console.log("Form submitted:", formData);
//       setFormData({
//         firstName: "",
//         lastName: "",
//         phone: "",
//         email: "",
//         password: "",
//       });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Handle Google login
//   const handleGoogleLogin = async () => {
//     try {
//       setError('');
//       await loginWithGoogle();
//       router.push('/homepage'); // Redirect only after successful Google login
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // If user is already logged in, don't render the form
//   if (user) {
//     return null; // Or you can add a loading spinner here
//   }

//   return (
//     <div className="min-h-screen bg-white flex">
//       <Head>
//         <title>Beri Barang - Daftar</title>
//         <meta
//           name="description"
//           content="Beri Barang donation registration page"
//         />
//       </Head>

//       {/* Container */}
//       <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
//         {/* Logo */}
//         <div className="absolute top-8 left-8">
//           <div className="flex items-center">
//             <div className="h-10 w-10">
//               <Image
//                 src="/logo.png"
//                 alt="Beri Barang Logo"
//                 width={50}
//                 height={50}
//                 className="object-contain"
//               />
//             </div>
//             <span className="ml-2 text-amber-800 font-bold text-xl">
//               Beri Barang
//             </span>
//           </div>
//         </div>

//         {/* Left Side - Illustration */}
//         <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
//           <div className="bg-amber-50 rounded-lg p-8 max-w-md">
//             <div className="relative">
//               <Image
//                 src="/donation-illustration.png"
//                 alt="Donation Illustration"
//                 width={400}
//                 height={400}
//                 className="object-contain"
//               />
//               <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-lg border-2 border-amber-400">
//                 <p className="text-amber-800 font-bold">YUK, DONASI!</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Registration Form */}
//         <div className="w-full md:w-1/2 md:pl-12">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">DAFTAR</h1>
//           <p className="text-gray-700 mb-6">
//             Bersama menyejahterakan masyarakat
//           </p>

//           {error && (
//             <p className="text-red-500 text-center mb-4">{error}</p>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* First and Last Name */}
//             <div className="flex gap-4 mb-4">
//               <div className="w-1/2">
//                 <label
//                   htmlFor="firstName"
//                   className="block text-gray-700 font-medium mb-1"
//                 >
//                   Nama Depan
//                 </label>
//                 <input
//                   type="text"
//                   id="firstName"
//                   name="firstName"
//                   placeholder="Matthew"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label
//                   htmlFor="lastName"
//                   className="block text-gray-700 font-medium mb-1"
//                 >
//                   Nama Belakang
//                 </label>
//                 <input
//                   type="text"
//                   id="lastName"
//                   name="lastName"
//                   placeholder="Emmanuel"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div className="mb-4">
//               <label
//                 htmlFor="phone"
//                 className="block text-gray-700 font-medium mb-1"
//               >
//                 Nomor Telepon (Whatsapp)
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 placeholder="081246875123"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-gray-700 font-medium mb-1"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="example@email.com"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div className="mb-6">
//               <label
//                 htmlFor="password"
//                 className="block text-gray-700 font-medium mb-1"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="Masukkan minimum 8 karakter"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
//                 value={formData.password}
//                 onChange={handleChange}
//                 minLength={8}
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-medium rounded-md transition duration-200"
//             >
//               Buat Akun
//             </button>

//             {/* Divider */}
//             <div className="flex items-center my-6">
//               <div className="flex-grow border-t border-gray-300"></div>
//               <span className="px-3 text-gray-500 text-sm">
//                 atau menggunakan
//               </span>
//               <div className="flex-grow border-t border-gray-300"></div>
//             </div>

//             {/* Google Sign Up */}
//             <button
//               type="button"
//               onClick={handleGoogleLogin}
//               className="w-full py-3 border border-gray-300 flex justify-center items-center gap-2 rounded-md hover:bg-gray-50 transition duration-200"
//             >
//               <FcGoogle size={20} /> 
//               <span>Google</span>
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc"; 
import { useRouter } from 'next/navigation';
import {
  registerWithEmail,
  loginWithGoogle,
  onAuthStateChange,
} from '../auth/auth';  

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      // Remove automatic redirect; let the user stay on the page
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerWithEmail(formData.email, formData.password);
      console.log("Form submitted:", formData);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
      });
      router.push('/homepage'); // Redirect only after successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      router.push('/homepage'); // Redirect only after successful Google login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Head>
        <title>Beri Barang - Daftar</title>
        <meta
          name="description"
          content="Beri Barang donation registration page"
        />
      </Head>

      <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
        <div className="absolute top-8 left-8">
          <div className="flex items-center">
            <div className="h-10 w-10">
              <Image
                src="/logo.png"
                alt="Beri Barang Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <span className="ml-2 text-amber-800 font-bold text-xl">
              Beri Barang
            </span>
          </div>
        </div>

        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <div className="bg-amber-50 rounded-lg p-8 max-w-md">
            <div className="relative">
              <Image
                src="/donation-illustration.png"
                alt="Donation Illustration"
                width={400}
                height={400}
                className="object-contain"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-lg border-2 border-amber-400">
                <p className="text-amber-800 font-bold">YUK, DONASI!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 md:pl-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DAFTAR</h1>
          <p className="text-gray-700 mb-6">
            Bersama menyejahterakan masyarakat
          </p>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          {user && (
            <p className="text-green-500 text-center mb-4">
              Anda sudah login sebagai {user.email}. Ingin menggunakan akun lain?
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Nama Depan
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Matthew"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Nama Belakang
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Emmanuel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-1"
              >
                Nomor Telepon (Whatsapp)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="081246875123"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Masukkan minimum 8 karakter"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-medium rounded-md transition duration-200"
            >
              Buat Akun
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">
                atau menggunakan
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 border border-gray-300 flex justify-center items-center gap-2 rounded-md hover:bg-gray-50 transition duration-200"
            >
              <FcGoogle size={20} /> 
              <span>Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}