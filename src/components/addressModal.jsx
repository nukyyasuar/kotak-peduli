import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { ButtonCustom } from "./button";
import { FormInput } from "./formInput";
import { useForm } from "react-hook-form";

const DEFAULT_LOCATION = { lat: -6.2088, lng: 106.8456 };

export default function AddressModal({
  isOpen,
  handleClose,
  // control,
  // register,
  // watch,
  setValue,
}) {
  const [mapError, setMapError] = useState(null);
  const [geolocationError, setGeolocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const autocompleteRef = useRef(null);
  const streetInputRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  const {
    control,
    getValues: getValueDetail,
    register,
    watch,
    setValue: setValueDetail,
  } = useForm({
    defaultValues: {
      alamat: {
        latitude: "",
        longitude: "",
        jalan: "",
        patokan: "",
        summary: "",
      },
    },
  });

  // Funtion mengambil current location user
  const getUserLocation = (callback) => {
    if (!navigator.geolocation) {
      setGeolocationError("Geolocation tidak didukung oleh browser Anda.");
      callback(DEFAULT_LOCATION);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setValueDetail("alamat.latitude", location.lat);
        setValueDetail("alamat.longitude", location.lng);
        setIsLocating(false);
        setGeolocationError(null);
        callback(location);
      },
      (error) => {
        setIsLocating(false);
        let message;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Izin lokasi ditolak.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            message = "Permintaan lokasi melebihi batas waktu.";
            break;
          default:
            message = "Gagal mendapatkan lokasi.";
        }
        setGeolocationError(message);
        callback(DEFAULT_LOCATION);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  // Function geocode translate koordinat (lat, lng) menjadi alamat lengkap
  const reverseGeocode = (location, callback) => {
    if (!window.google?.maps) {
      callback("Tidak dapat menemukan alamat");
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results[0]) {
        callback(results[0].formatted_address);
      } else {
        callback("Tidak dapat menemukan alamat untuk lokasi ini");
      }
    });
  };
  // Fungsi ambil current location ketika modal dibuka
  const initMap = (initialLocation) => {
    if (!mapRef.current || !window.google?.maps) return;

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
      const clicked = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      if (window.currentMarker) {
        window.currentMarker.setMap(null);
      }

      window.currentMarker = new google.maps.Marker({
        position: clicked,
        map,
        title: "Lokasi Terpilih",
      });

      reverseGeocode(clicked, (address) => {
        setValueDetail("alamat.jalan", address);
      });

      map.panTo(clicked);
    });
  };
  // Function update peta dengan lokasi baru (dari user atau hasil pencarian)
  const updateMapWithLocation = (location) => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

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
      setValueDetail("alamat.jalan", address);
    });
  };
  // Function untuk mengupdate peta berdasarkan alamat
  const updateMapWithAddress = (address) => {
    if (!address) {
      // Jika alamat kosong, cari lokasi pengguna
      getUserLocation((location) => {
        updateMapWithLocation(location);
      });
    } else {
      // Jika alamat terisi, lakukan geocode untuk mendapatkan lokasi
      if (!window.google?.maps) return;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          setValueDetail("alamat.latitude", location.lat);
          setValueDetail("alamat.longitude", location.lng);
          updateMapWithLocation(location);
        } else {
          console.error("Alamat tidak ditemukan");
        }
      });
    }
  };
  // Function reset peta ke lokasi pengguna saat ini
  window.resetToUserLocation = () => {
    getUserLocation((loc) => {
      updateMapWithLocation(loc);
      console.log(`Lokasi ditemukan dengan akurasi ${loc.accuracy} meter`);
    });
  };
  // Function inisialisasi fitur autocomplete alamat (input manual), ketik sendiri dan pilih dari recommended list
  const initAutocomplete = () => {
    if (!streetInputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(
      streetInputRef.current,
      {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "id" },
        fields: ["formatted_address", "geometry", "name"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setValueDetail("alamat.latitude", location.lat);
        setValueDetail("alamat.longitude", location.lng);
        setValueDetail("jalan", place.formatted_address);
        updateMapWithLocation(location);
      }
    });
  };
  // Function memuat Gmaps script hanya sekali
  const loadGoogleMapsScript = () => {
    if (scriptLoadedRef.current || window.google?.maps?.places) return;

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
    window.initGoogleMaps = () => setMapError(null);
    document.head.appendChild(script);
  };
  // Function handle menyimpan lokasi yang dipilih ke 'alamat'. Pada button 'simpan' di modal
  const handleSaveLocation = () => {
    if (watch("alamat.jalan")) {
      setValueDetail(
        "alamat.summary",
        `${watch("alamat.patokan") ? `(${watch("alamat.patokan")}) ` : ""}${watch("alamat.jalan")}`
      );
      setValue("alamat", getValueDetail("alamat"));
    } else {
      console.log("No location selected");
    }
    handleClose();
  };

  // Saat modal dibuka, inisialisasi map & autocomplete
  useEffect(() => {
    if (!isOpen || !window.google?.maps?.places) return;

    const summary = watch("alamat.summary");
    setGeolocationError(null);
    setMapError(null);
    if (summary) {
      const match = summary?.match(/\((.*?)\)\s*(.*)/);
      if (match) {
        const [, patokan, jalan] = match;
        setValueDetail("alamat.patokan", patokan);
        setValueDetail("alamat.jalan", jalan);
      } else {
        setValueDetail("alamat.patokan", "");
        setValueDetail("alamat.jalan", summary);
      }
    }

    if (watch("alamat.jalan")) {
      initMap(watch("alamat.jalan"));
      updateMapWithAddress(watch("alamat.jalan"));
    } else {
      getUserLocation((location) => {
        initMap(location);
        setValueDetail("alamat.latitude", location.lat);
        setValueDetail("alamat.longitude", location.lng);
        reverseGeocode(location, (address) => {
          if (!watch("alamat.jalan")) setValueDetail("alamat.jalan", address);
        });
      });
    }
    initAutocomplete();
  }, [isOpen]);
  // Load script hanya saat mount
  useEffect(() => {
    loadGoogleMapsScript();
  }, []);
  // Cleanup saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
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
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-20">
      <div className="bg-white rounded-lg flex flex-col p-8 text-black gap-6 w-lg">
        <h3 className="text-xl font-bold">Detail Alamat</h3>
        <div className="space-y-4 max-h-[50dvh] overflow-scroll no-scrollbar">
          <FormInput
            ref={streetInputRef}
            name="alamat.jalan"
            control={control}
            inputType="controlledText"
            label="Nama Jalan, Perumahan, Komplek"
            placeholder={
              isLocating
                ? "Sedang mencari lokasi Anda..."
                : "Masukkan nama jalan atau klik peta"
            }
            onChange={(val) => setValueDetail("alamat.jalan", val)}
            disabled={isLocating}
          />
          <FormInput
            inputType="text"
            label="Patokan, Blok, No. Rumah"
            placeholder="Contoh: Blok Z, No. 99"
            register={register("alamat.patokan")}
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
              <p className="mt-1 text-sm text-[#E52020]">{geolocationError}</p>
            )}
            <button
              className="mt-2 flex items-center justify-center bg-[#F0BB78] text-white py-1 rounded-md hover:bg-amber-200 w-full"
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  window.resetToUserLocation
                ) {
                  window.resetToUserLocation();
                }
              }}
              disabled={isLocating}
            >
              <Icon icon="mdi:map-marker" className="h-5 w-5" />
              {isLocating ? "Mencari Lokasi Anda..." : "Kembali ke Lokasi Saya"}
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 rounded-b-lg h-10">
          <ButtonCustom
            label="Simpan"
            onClick={handleSaveLocation}
            variant="brown"
            className="w-full"
            type="button"
          />
          <ButtonCustom
            label="Batal"
            onClick={handleClose}
            variant="white"
            className="w-full"
            type="button"
          />
        </div>
      </div>
    </div>
  );
}
