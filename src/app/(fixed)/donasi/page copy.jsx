"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { FormInput } from "src/components/formInput";
import { useForm } from "react-hook-form";
import { ButtonCustom } from "src/components/button";
import AddressModal from "src/components/addressModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geolocationError, setGeolocationError] = useState();
  const [isLocating, setIsLocating] = useState(false);
  const [mapError, setMapError] = useState();
  const mapRef = useRef();
  const mapInstanceRef = useRef();
  const streetInputRef = useRef();
  const autocompleteRef = useRef();
  const scriptLoadedRef = useRef(false);

  const [isAddDonationType, setIsAddDonationType] = useState(false);
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      namaLengkap: "",
      nomorTelepon: "",
      alamat: "",
      tempatPenampung: "",
      cabang: "",
      tipePengiriman: "",
      jalan: "",
      patokan: "",
      barangDonasi: [],
    },
  });
  const dummyOptions = [
    { value: "opsi_satu", label: "Opsi 1" },
    { value: "opsi_dua", label: "Opsi 2" },
    { value: "opsi_tiga", label: "Opsi 3" },
  ];
  const dummyDonationTypes = [
    { value: "pakaian", label: "Pakaian" },
    { value: "mainan", label: "Mainan" },
    { value: "alat_elektronik", label: "Elektronik" },
    { value: "buku", label: "Buku" },
  ];

  // Function handle ketika menambah jenis barang. Pada button 'add'
  const handleAddDonationType = (value, label) => {
    setIsAddDonationType(!isAddDonationType);

    const exists = watch("barangDonasi").find((item) => item.value === value);
    if (!exists) {
      setValue("barangDonasi", [
        ...watch("barangDonasi"),
        {
          jenis: value,
          label: label,
          jumlah: "",
          berat: "",
          event: "",
          foto: "",
        },
      ]);
    }
  };
  // Function handle hapus form jenis barang. Pada button 'trash' di setiap form
  const handleRemoveDonationItem = (valueToRemove) => {
    const updatedItems = watch("barangDonasi").filter(
      (item) => item.value !== valueToRemove
    );
    setValue("barangDonasi", updatedItems);
  };
  // Function submit. Pada button 'kirim'
  const onSubmit = (data) => {
    console.log(data);
  };

  // // GMAPS
  // Function modal alamat
  const handleAddressModal = () => {
    setIsModalOpen(!isModalOpen);
    setGeolocationError(null);
    setMapError(null);
    if (!isModalOpen) {
      const alamat = watch("alamat");
      if (alamat) {
        const regex = /\((.*?)\)\s*(.*)/;
        const match = alamat.match(regex);
        if (match) {
          const [, patokan, jalan] = match;
          setValue("patokan", patokan);
          setValue("jalan", jalan);
        } else {
          setValue("patokan", "");
          setValue("jalan", alamat);
        }
      }
    } else {
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
  // Function handle menyimpan lokasi yang dipilih ke 'alamat'. Pada button 'simpan' di modal
  const handleSaveLocation = () => {
    if (watch("jalan")) {
      setValue(
        "alamat",
        `${watch("patokan") && `(${watch("patokan")})`} ${watch("jalan")}`
      );
    } else {
      console.log("No location selected");
    }
    handleAddressModal();
  };
  // Funtion mengambil current location user
  const getUserLocation = (callback) => {
    if (!navigator.geolocation) {
      setGeolocationError("Geolocation tidak didukung oleh browser Anda.");
      callback({ lat: -6.2088, lng: 106.8456 });
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
        setIsLocating(false);
        setGeolocationError(null);
        callback(userLocation);
      },
      (error) => {
        setIsLocating(false);
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Izin lokasi ditolak.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage = "Permintaan lokasi melebihi batas waktu.";
            break;
          default:
            errorMessage = "Gagal mendapatkan lokasi.";
        }
        setGeolocationError(errorMessage);
        callback({ lat: -6.2088, lng: 106.8456 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  // Function geocode translate koordinat (lat, lng) menjadi alamat lengkap
  const reverseGeocode = (location, callback) => {
    if (!window.google?.maps) {
      console.error("Google Maps API tidak tersedia");
      callback("Tidak dapat menemukan alamat");
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results[0]) {
        callback(results[0].formatted_address);
      } else {
        console.error("Geocoding gagal:", status);
        callback("Tidak dapat menemukan alamat untuk lokasi ini");
      }
    });
  };
  //
  // Fungsi ambil current location ketika modal dibuka
  const initMap = (initialLocation) => {
    if (!mapRef.current || !window.google?.maps) {
      console.error("Google Maps API tidak tersedia");
      setMapError("Gagal memuat peta.");
      return;
    }

    const map = new google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
    });
    mapInstanceRef.current = map;

    window.currentMarker = new google.maps.Marker({
      position: initialLocation,
      map,
      title: "Lokasi Anda",
    });

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
        map,
        title: "Lokasi Terpilih",
      });

      reverseGeocode(clickedLocation, (address) => {
        setValue("jalan", address);
      });

      map.panTo(clickedLocation);
    });
  };

  // Function update peta dengan lokasi baru (dari user atau hasil pencarian)
  const updateMapWithLocation = (location) => {
    if (!mapInstanceRef.current || !window.google?.maps) {
      console.error("Map instance tidak tersedia");
      setMapError("Gagal memperbarui peta.");
      return;
    }

    mapInstanceRef.current.setCenter(location);

    if (window.currentMarker) {
      window.currentMarker.setMap(null);
    }

    window.currentMarker = new google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      title: "Lokasi Baru",
    });

    reverseGeocode(location, (address) => {
      setValue("jalan", address);
    });
  };
  // Function reset peta ke lokasi pengguna saat ini
  window.resetToUserLocation = () => {
    getUserLocation((location) => {
      updateMapWithLocation(location);
      console.log(`Lokasi ditemukan dengan akurasi ${location.accuracy} meter`);
    });
  };
  // Function inisialisasi fitur autocomplete alamat (input manual)
  const initAutocomplete = () => {
    if (!streetInputRef.current) {
      setMapError("Input alamat tidak ditemukan.");
      return;
    }
    if (!window.google?.maps?.places) {
      setMapError("Google Places API tidak tersedia.");
      return;
    }

    autocompleteRef.current = new google.maps.places.Autocomplete(
      streetInputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "id" },
        fields: ["formatted_address", "geometry", "name"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      console.log("Selected place:", place);
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setValue("jalan", place.formatted_address);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(location);
          if (window.currentMarker) {
            window.currentMarker.setMap(null);
          }
          window.currentMarker = new google.maps.Marker({
            position: location,
            map: mapInstanceRef.current,
            title: "Alamat Terpilih",
          });
        }
      } else {
        console.error("Place tidak memiliki geometry");
      }
    });
  };
  // Function memuat Gmaps script hanya sekali
  const loadGoogleMapsScript = () => {
    if (scriptLoadedRef.current || window.google?.maps?.places) {
      return;
    }

    scriptLoadedRef.current = true;
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBTJ0RDz8V6qAOZARcoMaVttH1Rco05I60&libraries=places&callback=initGoogleMaps";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setMapError("Gagal memuat Google Maps.");
      scriptLoadedRef.current = false;
    };

    window.initGoogleMaps = () => {
      setMapError(null);
    };

    document.head.appendChild(script);
  };

  // Saat modal dibuka, inisialisasi map & autocomplete
  useEffect(() => {
    if (!isModalOpen) return;

    if (!window.google?.maps?.places) {
      setMapError("Menunggu Google Maps dimuat...");
      return;
    }

    getUserLocation((location) => {
      initMap(location);
      reverseGeocode(location, (address) => {
        if (!watch("jalan")) {
          setValue("jalan", address);
        }
      });
      initAutocomplete();
    });
  }, [isModalOpen]);
  // Cleanup semua instance Google Maps saat unmount
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
  // Load Google Maps API script saat komponen mount
  useEffect(() => {
    loadGoogleMapsScript();
  }, []);
  // // END GMAPS

  return (
    <section className="bg-white py-12 flex flex-col justify-center text-black">
      <div className="max-w-[1200px] mx-auto">
        {/* Title */}
        <div className="w-full flex justify-center mb-6">
          <div className="text-center w-1/2">
            <h1 className="text-[32px] font-bold">Yuk Donasikan Barangmu</h1>
            <p className="text-[#543A14] text-base">
              Isi form berikut untuk mendeskripsikan barang yang ingin kamu
              donasikan dan bantu kami menyalurkan barangmu kepada yang
              membutuhkan.
            </p>
          </div>
        </div>

        {/* Form General Info */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center w-[1200px] gap-5"
        >
          <div className="flex gap-5 w-full">
            <div className="flex flex-col space-y-3 w-fit">
              <h3 className="text-xl font-bold">Informasi Donatur</h3>
              <div className="flex gap-5">
                <FormInput
                  label="Nama Lengkap"
                  inputType="text"
                  placeholder="Contoh: Matthew Emmanuel"
                  register={register("namaLengkap")}
                />
                <FormInput
                  label="Nomor Telepon (Whatsapp)"
                  inputType="text"
                  placeholder="Contoh: 81212312312"
                  register={register("nomorTelepon")}
                />
              </div>
              <FormInput
                label="Alamat Lengkap"
                inputType="textArea"
                placeholder="Contoh: Jl. Tanah Air, Blok. A, No. 1, Alam Sutera"
                register={register("alamat")}
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="flex-1"
              />
            </div>
            <div className="space-y-3 w-full">
              <h3 className="text-xl font-bold">Tujuan Donasi</h3>
              <FormInput
                inputType="dropdownInput"
                label="Tempat Penampung"
                name="tempatPenampung"
                control={control}
                options={dummyOptions}
                placeholder="Pilih tempat penampung tujuan donasi"
              />
              <FormInput
                inputType="dropdownInput"
                label="Cabang / Drop Point"
                name="cabang"
                control={control}
                options={dummyOptions}
                placeholder="Pilih cabang atau drop point (jika tersedia)"
              />
              <FormInput
                inputType="dropdownInput"
                label="Metode Pengiriman"
                name="tipePengiriman"
                control={control}
                options={dummyOptions}
                placeholder="Pilih cabang atau drop point (jika tersedia)"
              />
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-xl font-bold mb-3">Jenis Barang Donasi</h3>

            {/* Form Detail Barang */}
            {watch("barangDonasi").map((item, index) => (
              <div
                key={index}
                className="bg-[#FFF0DC] px-5 pb-5 rounded-lg mb-3 relative"
              >
                {/* Jenis Barang */}
                <div className="w-full flex justify-center mb-3">
                  <p className="text-base font-bold text-white bg-[#543a14] text-center px-6 py-2 w-fit rounded-b-lg">
                    {item.label}
                  </p>
                </div>
                <button
                  className="absolute top-0 right-0 px-2 bg-[#E52020] h-9 rounded-bl-lg cursor-pointer"
                  onClick={() => handleRemoveDonationItem(item.value)}
                >
                  <Icon icon="mdi:trash" width={20} color="white" />
                </button>
                <div className="space-y-3">
                  {/* Jumlah & Berat */}
                  <div className="flex gap-5">
                    <FormInput
                      label="Jumlah Barang"
                      inputType="text"
                      placeholder="Contoh: 20"
                      register={register(`barangDonasi.${index}.jumlah`)}
                    />
                    <FormInput
                      label="Total Berat Barang (kg)"
                      inputType="text"
                      placeholder="Contoh: 10"
                      register={register(`barangDonasi.${index}.berat`)}
                    />
                  </div>
                  {/* Foto & Event */}
                  <div className="flex gap-5 items-center">
                    <div className="flex items-end gap-3 flex-1">
                      <FormInput
                        inputType="text"
                        placeholder=".jpg, .png"
                        label="Foto Barang"
                        className="pointer-events-none"
                        value={watch(`barangDonasi.${index}.foto.name`)}
                      />
                      <div className="flex">
                        <label
                          htmlFor={`fotoBarang-${index}`}
                          className="px-4 py-3 bg-[#F0BB78] text-nowrap rounded-lg font-semibold text-white cursor-pointer"
                        >
                          Pilih File
                        </label>
                        <input
                          id={`fotoBarang-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setValue(`barangDonasi.${index}.foto`, file);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <FormInput
                      inputType="dropdownInput"
                      label="Event"
                      name={`barangDonasi.${index}.event`}
                      control={control}
                      options={dummyOptions}
                      placeholder="Pilih event tujuan donasi (jika tersedia)"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Button Tambah Jenis Barang */}
            {watch("barangDonasi").length !== dummyDonationTypes.length && (
              <div className="flex gap-6 max-h-10">
                <ButtonCustom
                  variant="orange"
                  label="Tambah Jenis Barang"
                  onClick={() => setIsAddDonationType(!isAddDonationType)}
                  icon="mdi:plus"
                  className="max-w-1/4"
                  type="button"
                />
                {isAddDonationType && (
                  <div className="flex gap-3">
                    {dummyDonationTypes.map(({ value, label }) => {
                      const isDisabled = watch("barangDonasi").some(
                        (item) => item.value === value
                      );

                      return (
                        <ButtonCustom
                          key={value}
                          variant={isDisabled ? "" : "outlineOrange"}
                          label={label}
                          onClick={() =>
                            !isDisabled && handleAddDonationType(value, label)
                          }
                          type="button"
                          className={
                            isDisabled &&
                            "bg-[#F0BB78] text-white cursor-not-allowed"
                          }
                          disabled={isDisabled}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#543a14] hover:bg-[#6B4D20] text-white h-12 rounded-lg font-bold"
          >
            Kirim
          </button>
        </form>

        {/* Modal Alamat Lengkap */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-20">
            <div className="bg-white rounded-lg flex flex-col p-8 text-black gap-6 w-lg">
              <h3 className="text-xl font-bold">Detail Alamat</h3>
              <div className="space-y-4 max-h-[50dvh] overflow-scroll no-scrollbar">
                <FormInput
                  ref={streetInputRef}
                  name="jalan"
                  control={control}
                  inputType="controlledText"
                  label="Nama Jalan, Perumahan, Komplek"
                  placeholder={
                    isLocating
                      ? "Sedang mencari lokasi Anda..."
                      : "Masukkan nama jalan atau klik peta"
                  }
                  onChange={(val) => setValue("jalan", val)}
                  disabled={isLocating}
                />
                <FormInput
                  inputType="text"
                  label="Patokan, Blok, No. Rumah"
                  placeholder="Contoh: Blok Z, No. 99"
                  register={register("patokan")}
                />
                <div>
                  <FormInput label="Peta (Jika Tersedia)" />
                  <div
                    ref={mapRef}
                    className="border border-[#C2C2C2] rounded-lg h-56 w-full mb-1"
                  />
                  {mapError && (
                    <p className="mt-1 text-sm text-[#E52020]">{mapError}</p>
                  )}
                  {geolocationError && (
                    <p className="mt-1 text-sm text-[#E52020]">
                      {geolocationError}
                    </p>
                  )}
                  <button
                    className="mt-2 flex items-center justify-center bg-[#F0BB78] text-white py-1 rounded-md hover:bg-amber-200 w-full"
                    onClick={() =>
                      window.resetToUserLocation && window.resetToUserLocation()
                    }
                    disabled={isLocating}
                  >
                    <Icon icon="mdi:map-marker" className="h-5 w-5" />
                    {isLocating
                      ? "Mencari Lokasi Anda..."
                      : "Kembali ke Lokasi Saya"}
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-3 rounded-b-lg h-10">
                <ButtonCustom
                  label="Simpan"
                  onClick={handleSaveLocation}
                  variant="brown"
                />
                <ButtonCustom
                  label="Batal"
                  onClick={handleAddressModal}
                  variant="white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
