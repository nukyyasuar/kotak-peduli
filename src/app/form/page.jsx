"use client";

import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import NavbarAfterLogin from "../navbarAfterLogin/page";
import Footer from "../footer/page";
import { Icon } from "@iconify/react";

export default function Home() {
  const [donationItems, setDonationItems] = useState([]);
  const [fileNames, setFileNames] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [geolocationError, setGeolocationError] = useState(null);
  const [streetInput, setStreetInput] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nomorTelpon: "",
    alamatLengkap: "",
    tempatPenampungan: "",
    cabangDropPoint: "",
    metodePengiriman: "",
    items: [],
  });
  const fileInputRefs = useRef({});
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const streetInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  // Function to handle file selection for a specific section
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setFileNames((prev) => ({ ...prev, [index]: file.name }));
      setFormData((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[index] = { ...updatedItems[index], file };
        return { ...prev, items: updatedItems };
      });
    }
  };

  // Function to trigger the file input click for a specific section
  const handleFileButtonClick = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  // Function to open/close the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setGeolocationError(null);
    setMapError(null);
    if (!isModalOpen) {
      setStreetInput("");
    } else {
      // Reset map instance when closing modal
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
        mapInstanceRef.current = null;
      }
      if (window.currentMarker) {
        window.currentMarker.setMap(null);
        window.currentMarker = null;
      }
    }
  };

  // Function to handle saving the location
  const handleSaveLocation = () => {
    if (selectedLocation) {
      console.log("Saved location:", selectedLocation);
      setFormData((prev) => ({
        ...prev,
        alamatLengkap: streetInput || `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`,
      }));
    } else {
      console.log("No location selected");
    }
    toggleModal();
  };

  // Function to add a new "Jenis Barang Donasi" section (up to 2)
  const addDonationItem = () => {
    if (donationItems.length < 2) {
      setDonationItems([...donationItems, {}]);
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { event: "", jumlah: "", berat: "", file: null }],
      }));
    }
  };

  // Function to remove a specific "Jenis Barang Donasi" section
  const removeDonationItem = (index) => {
    setDonationItems(donationItems.filter((_, i) => i !== index));
    setFileNames((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
    setFormData((prev) => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: updatedItems };
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add logic to send formData to backend API
  };

  // Function to handle input changes for donation items
  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, items: updatedItems };
    });
  };

  // Function to get user's current location with high accuracy
  const getUserLocation = (callback) => {
    if (!navigator.geolocation) {
      setGeolocationError("Geolocation tidak didukung oleh browser Anda.");
      callback({ lat: -6.2088, lng: 106.8456 }); // Fallback to Jakarta
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setGeolocationError(null);
        setIsLocating(false);
        callback(userLocation);
      },
      (error) => {
        setIsLocating(false);
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Izin lokasi ditolak. Silakan aktifkan izin lokasi.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Lokasi tidak tersedia. Menggunakan lokasi default.";
            break;
          case error.TIMEOUT:
            errorMessage = "Waktu untuk mendapatkan lokasi habis.";
            break;
          default:
            errorMessage = "Terjadi kesalahan saat mendapatkan lokasi.";
        }
        setGeolocationError(errorMessage);
        callback({ lat: -6.2088, lng: 106.8456 }); // Fallback to Jakarta
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Function to reverse geocode coordinates to street address
  const reverseGeocode = (location, callback) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not available for geocoding");
      callback("Tidak dapat menemukan alamat");
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results[0]) {
        callback(results[0].formatted_address);
      } else {
        console.error("Geocoding failed:", status);
        callback("Tidak dapat menemukan alamat untuk lokasi ini");
      }
    });
  };

  // Function to initialize or update the map
  const initMap = (initialLocation) => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error("Map container or Google Maps API not available");
      setMapError("Gagal memuat peta. Silakan coba lagi nanti.");
      return;
    }

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
    });

    const map = mapInstanceRef.current;

    window.currentMarker = new google.maps.Marker({
      position: initialLocation,
      map: map,
      title: "Your Location",
    });

    setSelectedLocation(initialLocation);

    map.addListener("click", (event) => {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      if (window.currentMarker) {
        window.currentMarker.setMap(null);
      }

      window.currentMarker = new google.maps.Marker({
        position: clickedLocation,
        map: map,
        title: "Selected Location",
      });

      setSelectedLocation(clickedLocation);
      reverseGeocode(clickedLocation, (address) => {
        setStreetInput(address);
      });
      map.panTo(clickedLocation);
    });
  };

  // Function to update map with new location
  const updateMapWithLocation = (location) => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) {
      console.error("Map instance or Google Maps API not available");
      setMapError("Gagal memperbarui peta. Silakan coba lagi.");
      return;
    }

    mapInstanceRef.current.setCenter(location);

    if (window.currentMarker) {
      window.currentMarker.setMap(null);
    }

    window.currentMarker = new google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      title: "Lokasi Anda",
    });

    setSelectedLocation(location);

    reverseGeocode(location, (address) => {
      setStreetInput(address);
    });
  };

  // Function to reset to user location
  window.resetToUserLocation = () => {
    getUserLocation((location) => {
      updateMapWithLocation(location);
      console.log(`Lokasi ditemukan dengan akurasi ${location.accuracy} meter`);
    });
  };

  // Function to initialize Autocomplete
  const initAutocomplete = () => {
    if (!streetInputRef.current) {
      console.error("Street input reference is not set");
      setMapError("Input alamat tidak ditemukan.");
      return;
    }
    if (!window.google || !window.google.maps.places) {
      console.error("Google Maps Places API is not available");
      setMapError("Gagal memuat fitur pencarian alamat. Silakan masukkan alamat secara manual.");
      return;
    }

    console.log("Initializing Autocomplete...");
    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(streetInputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "id" },
        fields: ["formatted_address", "geometry"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        console.log("Place selected:", place);
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setStreetInput(place.formatted_address);
          setSelectedLocation(location);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(location);
            if (window.currentMarker) {
              window.currentMarker.setMap(null);
            }
            window.currentMarker = new google.maps.Marker({
              position: location,
              map: mapInstanceRef.current,
              title: "Selected Location",
            });
          }
        } else {
          console.error("No geometry available for selected place");
        }
      });
    } catch (error) {
      console.error("Failed to initialize Autocomplete:", error);
      setMapError("Gagal menginisialisasi pencarian alamat. Silakan masukkan alamat secara manual.");
    }
  };

  // Load Google Maps script
  useEffect(() => {
    if (scriptLoadedRef.current || (window.google && window.google.maps && window.google.maps.places)) {
      console.log("Google Maps API already loaded");
      return;
    }

    scriptLoadedRef.current = true;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBTJ0RDz8V6qAOZARcoMaVttH1Rco05I60&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google Maps script. Check API key, billing, and network.");
      setMapError("Gagal memuat Google Maps. Periksa koneksi internet atau hubungi admin.");
      scriptLoadedRef.current = false;
    };

    window.initGoogleMaps = () => {
      console.log("Google Maps API loaded successfully");
      setMapError(null); // Clear any previous errors
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      scriptLoadedRef.current = false;
      delete window.initGoogleMaps;
    };
  }, []);

  // Initialize map and autocomplete when modal opens
  useEffect(() => {
    if (!isModalOpen) return;

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.log("Waiting for Google Maps Places API...");
      setMapError("Menunggu Google Maps dimuat...");
      return;
    }

    getUserLocation((location) => {
      initMap(location);
      reverseGeocode(location, (address) => {
        setStreetInput(address);
      });
      initAutocomplete();
    });
  }, [isModalOpen]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
        mapInstanceRef.current = null;
      }
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      if (window.currentMarker) {
        window.currentMarker.setMap(null);
        window.currentMarker = null;
      }
      window.resetToUserLocation = null;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Head>
        <title>Beri Barang - Donasi Barang</title>
        <meta name="description" content="Platform donasi barang bekas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavbarAfterLogin />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-4xl font-bold text-center mb-2 text-[#131010]">
          Yuk Donasikan Barangmu
        </h1>
        <p className="text-center mb-8 text-[#543A14] text-sm">
          Pilih jenis barang terlebih dahulu dari daftar dibawah (bisa lebih dari satu)<br />
          & tempat penampung yang dituju
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-2 text-[#000000]">Informasi Donatur</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-bold text-[#000000]">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-[#C2C2C2]"
                    value={formData.namaLengkap}
                    onChange={(e) =>
                      setFormData({ ...formData, namaLengkap: e.target.value })
                    }
                    placeholder="Matthew Emmanuel"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-[#000000]">
                    Nomor Telpon (Whatsapp)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-[#C2C2C2]"
                    value={formData.nomorTelpon}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorTelpon: e.target.value })
                    }
                    placeholder="+62812468751243"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-[#000000]">
                    Alamat Lengkap{" "}
                    <span className="text-[#F0BB78] text-xs underline">
                      simpan sebagai rumah?
                    </span>
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-md p-2 text-[#C2C2C2]"
                    value={formData.alamatLengkap}
                    onChange={(e) =>
                      setFormData({ ...formData, alamatLengkap: e.target.value })
                    }
                    onClick={toggleModal}
                    placeholder="Jl. Tanah Air, Blok A, No. 1, Alam Sutera"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-[#000000]">Tujuan Donasi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-bold text-[#000000]">
                    Tempat Penampungan
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                      value={formData.tempatPenampungan}
                      onChange={(e) =>
                        setFormData({ ...formData, tempatPenampungan: e.target.value })
                      }
                    >
                      <option value="">Pilih tempat penampung tujuan donasi</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <Icon icon="mdi:chevron-down" className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-gray-700">
                    Cabang / Drop Point
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                      value={formData.cabangDropPoint}
                      onChange={(e) =>
                        setFormData({ ...formData, cabangDropPoint: e.target.value })
                      }
                    >
                      <option value="">Pilih cabang atau drop point (jika tersedia)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <Icon icon="mdi:chevron-down" className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-gray-700">
                    Metode Pengiriman
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                      value={formData.metodePengiriman}
                      onChange={(e) =>
                        setFormData({ ...formData, metodePengiriman: e.target.value })
                      }
                    >
                      <option value="">Pilih metode pengiriman barang</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <Icon icon="mdi:chevron-down" className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-[#000000]">Jenis Barang Donasi</h3>

            {donationItems.map((_, index) => (
              <div key={index} className="bg-[#FFF7E6] p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-2">
                    <label className="block mb-1 font-bold text-gray-700">
                      Event
                    </label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                        value={formData.items[index]?.event || ""}
                        onChange={(e) =>
                          handleItemChange(index, "event", e.target.value)
                        }
                      >
                        <option value="">Pilih event tujuan donasi (jika tersedia)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <Icon icon="mdi:chevron-down" className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center"
                    onClick={() => removeDonationItem(index)}
                  >
                    <Icon icon="mdi:close" className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-2">
                    <label className="block mb-1 font-bold text-gray-700">
                      Jumlah Barang
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                      value={formData.items[index]?.jumlah || ""}
                      onChange={(e) =>
                        handleItemChange(index, "jumlah", e.target.value)
                      }
                      placeholder="Contoh: 20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-bold text-gray-700">
                      Total Berat Barang (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-gray-700 pr-10"
                        value={formData.items[index]?.berat || ""}
                        onChange={(e) =>
                          handleItemChange(index, "berat", e.target.value)
                        }
                        placeholder="Contoh: 10"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                        kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 mr-2">
                    <label className="block mb-1 font-bold text-gray-700">
                      Foto Barang
                    </label>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      className="hidden"
                      accept=".jpg,.png"
                      onChange={(e) => handleFileChange(index, e)}
                    />
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                        value={fileNames[index] || ".jpg, .png"}
                        readOnly
                      />
                      <button
                        type="button"
                        className="ml-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md"
                        onClick={() => handleFileButtonClick(index)}
                      >
                        Pilih file
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {donationItems.length < 2 && (
              <button
                type="button"
                className="flex items-center bg-[#F0BB78] text-[#543A14] py-2 px-4 rounded-md font-bold hover:bg-amber-200"
                onClick={addDonationItem}
              >
                <Icon icon="mdi:plus" className="mr-2 h-5 w-5" />
                Tambah Jenis Barang
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-800 text-white py-3 rounded-md font-bold"
          >
            Kirim
          </button>
        </form>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-[#000000]">Detail Alamat</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Nama Jalan, Perumahan, Komplek
                  </label>
                  <input
                    type="text"
                    ref={streetInputRef}
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                    value={streetInput}
                    onChange={(e) => setStreetInput(e.target.value)}
                    placeholder="Masukkan nama jalan atau klik peta"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Patokan, Blok, No. Rumah
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                    placeholder="Blok Z, No. 99"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Peta (Jika tersedia)
                  </label>
                  <div
                    ref={mapRef}
                    className="border border-gray-300 rounded-md h-40 w-full"
                  />
                  {mapError && (
                    <p className="mt-2 text-sm text-red-600">{mapError}</p>
                  )}
                  {geolocationError && (
                    <p className="mt-2 text-sm text-red-600">{geolocationError}</p>
                  )}
                  <button
                    className="mt-2 flex items-center bg-[#F0BB78] text-[#543A14] py-1 px-3 rounded-md font-bold hover:bg-amber-200"
                    onClick={() => window.resetToUserLocation && window.resetToUserLocation()}
                    disabled={isLocating}
                  >
                    <Icon icon="mdi:map-marker" className="mr-1 h-5 w-5" />
                    {isLocating ? "Mencari Lokasi..." : "Kembali ke Lokasi Saya"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-end space-x-3 rounded-b-lg bg-transparent">
              <button
                className="flex-1 bg-[#F0BB78] text-[#543A14] py-2 rounded-md font-bold"
                onClick={handleSaveLocation}
              >
                Simpan
              </button>
              <button
                className="flex-1 bg-gray-300 text-[#543A14] py-2 rounded-md font-bold"
                onClick={toggleModal}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}