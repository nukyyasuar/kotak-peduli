// 'use client'

// // pages/login.js
// import Image from 'next/image';
// import Head from 'next/head';
// import { useState } from 'react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   return (
//     <div className="min-h-screen flex bg-white"> 
//       <Head>
//         <title>Beri Barang - Login</title>
//         <meta name="description" content="Login to Beri Barang" />
//       </Head>
      
//       <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center p-4">
//         {/* Left side with illustration */}
//         <div className="w-full md:w-1/2 mb-6 md:mb-0">
//           <div className="p-4">
//             <div className="mb-4">
//               <Image
//                 src="/logo.png" 
//                 alt="Beri Barang Logo"
//                 width={150}
//                 height={50}
//                 className="object-contain"
//               />
//             </div>
            
//             <div className="bg-[#FDF6E7] rounded-2xl p-4">
//               <div className="relative h-80 w-full">
//                 <Image
//                   src="/donation-illustration.png"
//                   alt="Donation Illustration"
//                   layout="fill"
//                   objectFit="contain"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Right side with form */}
//         <div className="w-full md:w-1/2 p-6">
//           <div className="max-w-md mx-auto">
//             <h1 className="text-4xl font-bold text-center mb-1">HALO,</h1>
//             <p className="text-center mb-8">Selamat datang kembali!</p>
            
//             <form>
//               <div className="mb-4">
//                 <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
//                   placeholder="example@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
              
//               <div className="mb-6">
//                 <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
//                   placeholder="Masukkan minimum 6 karakter"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
              
//               <button
//                 type="submit"
//                 className="w-full bg-[#F2CB92] hover:bg-amber-400 transition text-black py-3 px-4 rounded-lg font-medium mb-4"
//               >
//                 Buat Akun
//               </button>
              
//               <div className="flex items-center justify-center mb-4">
//                 <div className="h-px bg-gray-300 flex-1"></div>
//                 <p className="mx-4 text-sm text-gray-500">atau menggunakan</p>
//                 <div className="h-px bg-gray-300 flex-1"></div>
//               </div>
              
//               <button
//                 type="button"
//                 className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium"
//               >
//                 <Image 
//                   src="/google-icon.png" 
//                   alt="Google" 
//                   width={20} 
//                   height={20} 
//                   className="mr-2" 
//                 />
//                 Google
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client'

// // pages/login.js
// import Image from 'next/image';
// import Head from 'next/head';
// import { useState, useEffect } from 'react';
// import {
//   registerWithEmail,
//   loginWithEmail,
//   logout,
//   onAuthStateChange,
//   loginWithGoogle,
// } from '../auth/auth';  
// import { useRouter } from 'next/navigation';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState('');
//   const [isLogin, setIsLogin] = useState(true);
//   const router = useRouter();

//   // useEffect(() => {
//   //   const unsubscribe = onAuthStateChange((currentUser) => {
//   //     setUser(currentUser);
//   //     if (currentUser) {
//   //       // Redirect ke halaman dashboard setelah login berhasil
//   //       router.push('/homepage');
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       if (isLogin) {
//         await loginWithEmail(email, password);
//       } else {
//         await registerWithEmail(email, password);
//       }
//       setEmail('');
//       setPassword('');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Tambahkan fungsi untuk handle login Google
//   const handleGoogleLogin = async () => {
//     try {
//       setError('');
//       await loginWithGoogle();
//       router.push('/homepage'); // Redirect only after successful Google login
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Jika user sudah login, tidak perlu render form
//   if (user) {
//     return null; // atau bisa render loading spinner
//   }

//   return (
//     <div className="min-h-screen flex bg-white"> 
//       <Head>
//         <title>Beri Barang - {isLogin ? 'Login' : 'Register'}</title>
//         <meta name="description" content={isLogin ? 'Login to Beri Barang' : 'Register to Beri Barang'} />
//       </Head>
      
//       <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center p-4">
//         {/* Left side with illustration */}
//         <div className="w-full md:w-1/2 mb-6 md:mb-0">
//           <div className="p-4">
//             <div className="mb-4">
//               <Image
//                 src="/logo.png" 
//                 alt="Beri Barang Logo"
//                 width={150}
//                 height={50}
//                 className="object-contain"
//               />
//             </div>
            
//             <div className="bg-[#FDF6E7] rounded-2xl p-4">
//               <div className="relative h-80 w-full">
//                 <Image
//                   src="/donation-illustration.png"
//                   alt="Donation Illustration"
//                   layout="fill"
//                   objectFit="contain"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Right side with form */}
//         <div className="w-full md:w-1/2 p-6">
//           <div className="max-w-md mx-auto">
//             <h1 className="text-4xl font-bold text-center mb-1">HALO,</h1>
//             <p className="text-center mb-8">
//               {isLogin ? 'Selamat datang kembali!' : 'Buat akun baru Anda!'}
//             </p>
            
//             {error && (
//               <p className="text-red-500 text-center mb-4">{error}</p>
//             )}
            
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
//                   placeholder="example@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
              
//               <div className="mb-6">
//                 <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
//                   placeholder="Masukkan minimum 6 karakter"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
              
//               <button
//                 type="submit"
//                 className="w-full bg-[#F2CB92] hover:bg-amber-400 transition text-black py-3 px-4 rounded-lg font-medium mb-4"
//               >
//                 {isLogin ? 'Masuk' : 'Buat Akun'}
//               </button>
              
//               <div className="flex items-center justify-center mb-4">
//                 <div className="h-px bg-gray-300 flex-1"></div>
//                 <p className="mx-4 text-sm text-gray-500">atau</p>
//                 <div className="h-px bg-gray-300 flex-1"></div>
//               </div>
              
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin} // tambahkan event handler
//                 className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium mb-4"
//               >
//                 <Image 
//                   src="/google-icon.png" 
//                   alt="Google" 
//                   width={20} 
//                   height={20} 
//                   className="mr-2" 
//                 />
//                 Google
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setIsLogin(!isLogin)}
//                 className="w-full text-center text-sm text-gray-600 hover:text-amber-600"
//               >
//                 {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'

import Image from 'next/image';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc"; 
import {
  registerWithEmail,
  loginWithEmail,
  logout,
  onAuthStateChange,
  loginWithGoogle,
} from '../auth/auth';  
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

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
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      setEmail('');
      setPassword('');
      // Optionally redirect after successful submission
      router.push('/homepage');
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
    <div className="min-h-screen flex bg-white"> 
      <Head>
        <title>Beri Barang - {isLogin ? 'Login' : 'Register'}</title>
        <meta name="description" content={isLogin ? 'Login to Beri Barang' : 'Register to Beri Barang'} />
      </Head>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center p-4">
        {/* Left side with illustration */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <div className="p-4">
            <div className="mb-4">
              <Image
                src="/logo.png" 
                alt="Beri Barang Logo"
                width={150}
                height={50}
                className="object-contain"
              />
            </div>
            
            <div className="bg-[#FDF6E7] rounded-2xl p-4">
              <div className="relative h-80 w-full">
                <Image
                  src="/donation-illustration.png"
                  alt="Donation Illustration"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side with form */}
        <div className="w-full md:w-1/2 p-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-center mb-1 text-black">HALO,</h1>
            <p className="text-center mb-8 text-black">
              {isLogin ? 'Selamat datang kembali!' : 'Buat akun baru Anda!'}
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
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Masukkan minimum 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#F2CB92] hover:bg-amber-400 transition text-black py-3 px-4 rounded-lg font-medium mb-4"
              >
                {isLogin ? 'Masuk' : 'Buat Akun'}
              </button>
              
              <div className="flex items-center justify-center mb-4">
                <div className="h-px bg-gray-300 flex-1"></div>
                <p className="mx-4 text-sm text-gray-500">atau</p>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium mb-4"
              >
                <FcGoogle size={20} /> 
                <span className='ml-2 font-bold'>Google</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-gray-600 hover:text-amber-600"
              >
                {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}