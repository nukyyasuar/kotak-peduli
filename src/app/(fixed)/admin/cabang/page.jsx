"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClipLoader } from "react-spinners";

import {
  getPostsWithParams,
  createPosts,
  deletePost,
  updatePost,
} from "src/services/api/post";
import postSchema from "src/components/schema/postSchema";
import { useAccess } from "src/services/auth/acl";

import Unauthorize from "src/components/unauthorize";
import { FormInput } from "src/components/formInput";
import { postTypesList } from "src/components/options";
import handleOutsideModal from "src/components/handleOutsideModal";
import { ButtonCustom } from "src/components/button";
import AddressModal from "src/components/addressModal";

export default function CollectionCenterPosts() {
  const isFirstFetchPosts = useRef(true);
  const [dataPosts, setDataPosts] = useState([]);
  const [selectedDataPost, setSelectedDataPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPostTypesFilters, setSelectedPostTypesFilters] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isLoadingCreateUpdatePost, setIsLoadingCreateUpdatePost] =
    useState(false);
  const [isLoadingDeletePost, setIsLoadingDeletePost] = useState(false);
  const [isLoadingFetchPosts, setIsLoadingFetchPosts] = useState(false);

  const deletePostsModalRef = useRef(null);
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(postSchema),
    mode: "onBlur",
    defaultValues: {
      nama: "",
      alamat: {},
      nomorTelepon: "",
      tipe: "",
    },
  });

  const canReadPost = useAccess("READ_POST");

  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("collectionCenterId");
    }
    return null;
  };
  const collectionCenterId = getInitialValue();

  handleOutsideModal({
    ref: deletePostsModalRef,
    isOpen: isDeletePostModalOpen,
    onClose: () => {
      setIsDeletePostModalOpen(false);
      reset();
    },
  });

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const fetchPosts = async (page, search, postTypeFilters) => {
    try {
      setIsLoadingFetchPosts(true);

      const result = await getPostsWithParams(
        collectionCenterId,
        page,
        search,
        postTypeFilters
      );

      setDataPosts(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalData(result.meta.total);

      if (isFirstFetchPosts.current) {
        // toast.success("Data cabang / drop point berhasil dimuat");
        isFirstFetchPosts.current = false;
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Gagal memuat data cabang / drop point");
    } finally {
      setIsLoadingFetchPosts(false);
    }
  };

  const onSubmitPost = async (data) => {
    const payload = {
      name: data.nama,
      type: data.tipe,
      phoneNumber: "+62" + data.nomorTelepon,
      address: {
        detail: data.alamat.jalan,
        ...(data.alamat.patokan && { reference: data.alamat.patokan }),
        latitude: data.alamat.latitude,
        longitude: data.alamat.longitude,
      },
    };

    if (isEditPostModalOpen) {
      try {
        setIsLoadingCreateUpdatePost(true);

        await updatePost(collectionCenterId, selectedPostId, payload);

        toast.success("Data cabang / drop point berhasil diubah");
        setIsEditPostModalOpen(false);
        reset();
        fetchPosts(currentPage, debouncedSearch, selectedPostTypesFilters);
      } catch (error) {
        console.error("Error updating post:", error);
        toast.error("Gagal mengubah data cabang / drop point");
      } finally {
        setIsLoadingCreateUpdatePost(false);
      }
    } else if (isAddPostModalOpen) {
      try {
        setIsLoadingCreateUpdatePost(true);

        await createPosts(collectionCenterId, payload);

        toast.success("Data cabang / drop point berhasil ditambahkan");
        setIsAddPostModalOpen(false);
        reset();
        fetchPosts(currentPage, debouncedSearch, selectedPostTypesFilters);
      } catch (error) {
        console.error("Error creating post:", error);
        toast.error("Gagal menambahkan data cabang / drop point");
      } finally {
        setIsLoadingCreateUpdatePost(false);
      }
    }
  };

  const onDeletePost = async () => {
    try {
      setIsLoadingDeletePost(true);

      await deletePost(collectionCenterId, selectedPostId);

      toast.success("Data cabang / drop point berhasil dihapus");
      setIsDeletePostModalOpen(false);
      reset();
      fetchPosts(currentPage, debouncedSearch, selectedPostTypesFilters);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Gagal menghapus data cabang / drop point");
    } finally {
      setIsLoadingDeletePost(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchKeyword]);

  useEffect(() => {
    if (isEditPostModalOpen && selectedPostId) {
      dataPosts.forEach((post) => {
        if (post.id === selectedPostId) {
          setSelectedDataPost(post);
          reset({
            nama: post.name,
            alamat: {
              jalan: post.address.detail,
              patokan: post.address.reference,
              latitude: post.address.latitude,
              longitude: post.address.longitude,
              summary:
                `(${post?.address?.reference}) ${post?.address?.detail}` || "",
            },
            nomorTelepon: post.phoneNumber.replace("+62", ""),
            tipe: post.type,
          });
        }
      });
    }
  }, [isEditPostModalOpen, selectedPostId]);

  useEffect(() => {
    if (isDeletePostModalOpen && selectedPostId) {
      dataPosts.forEach((post) => {
        if (post.id === selectedPostId) {
          setSelectedDataPost(post);
        }
      });
    }
  }, [isDeletePostModalOpen, selectedPostId]);

  useEffect(() => {
    if (watch("alamat.summary")) {
      clearErrors("alamat");
    }
  }, [watch("alamat.summary")]);

  useEffect(() => {
    if (!canReadPost) return;

    fetchPosts(currentPage, debouncedSearch, selectedPostTypesFilters);
  }, [currentPage, debouncedSearch, selectedPostTypesFilters, canReadPost]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedPostTypesFilters]);

  return (
    <div className="min-h-[92dvh] bg-[#F5E9D4] py-12">
      {!canReadPost ? (
        <Unauthorize />
      ) : (
        <main className="max-w-[1200px] mx-auto space-y-4 text-black">
          <h1 className="text-[32px] text-[#543A14] font-bold text-center">
            CABANG / DROP POINT
          </h1>

          {/* Fitur Tabel */}
          <div className="flex justify-between items-center mb-4">
            {/* Search */}
            <div className="relative">
              <FormInput
                inputType="text"
                placeholder="Cari nama cabang / drop point"
                inputStyles="bg-white w-3xs relative pl-10"
                value={searchKeyword}
                onChange={(keyword) => {
                  setSearchKeyword(keyword);
                }}
              />
              <Icon
                icon="cuida:search-outline"
                width={24}
                height={24}
                color="#C2C2C2"
                className="absolute top-1/2 -translate-y-1/2 left-2"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Filter */}
              {postTypesList.map((item) => (
                <label key={String(item.value)}>
                  <input
                    id={`types-${item.value}`}
                    type="checkbox"
                    value={item.value}
                    checked={selectedPostTypesFilters.includes(item.value)}
                    onChange={() => {
                      setSelectedPostTypesFilters((prev) =>
                        prev.includes(item.value)
                          ? prev.filter((v) => v !== item.value)
                          : [...prev, item.value]
                      );
                    }}
                    className="peer w-4 h-4 mr-2 accent-[#543A14]"
                  />
                  {item.label}
                </label>
              ))}

              {/* Button Tambah Cabang */}
              <ButtonCustom
                label="Tambah Data"
                variant="brown"
                icon="material-symbols:add"
                onClick={() => {
                  setIsAddPostModalOpen(true);
                }}
              />
            </div>
          </div>

          {/* Tabel Cabang */}
          <div
            className={`bg-white p-6 rounded-lg ${totalData <= 0 && "text-center"}`}
          >
            {isLoadingFetchPosts ? (
              <div className="flex justify-center">
                <ClipLoader
                  color="#543A14"
                  size={30}
                  loading={isLoadingFetchPosts}
                />
              </div>
            ) : totalData < 0 ? (
              "Data tidak ditemukan"
            ) : (
              <table className="w-full bg-white rounded-lg">
                <thead>
                  <tr className="text-left border-b border-b-[#EDEDED]">
                    <th className="pb-2">Nama</th>
                    <th className="pb-2">Alamat</th>
                    <th className="pb-2">No. Telepon</th>
                    <th className="pb-2">Tipe</th>
                    <th className="pb-2">Menu</th>
                  </tr>
                </thead>

                <tbody>
                  {dataPosts.map((item, index) => {
                    const formattedAddress = `(${item.address?.reference}) ${item.address?.detail}`;
                    const formattedType = postTypesList.find(
                      (type) => type.value === item.type
                    )?.label;

                    return (
                      <tr key={index} className="border-b border-b-[#EDEDED]">
                        <td className="py-3">{item.name}</td>
                        <td className="py-3 w-140">{formattedAddress}</td>
                        <td className="py-3">{item.phoneNumber}</td>
                        <td className="py-3">{formattedType}</td>
                        <td className="py-3 relative text-start">
                          <button
                            onClick={() => toggleMenu(index)}
                            className="border border-[#C2C2C2] rounded-sm p-1"
                          >
                            <Icon
                              icon="iconamoon:menu-burger-vertical"
                              width={16}
                              height={16}
                              color="black"
                              className="rotate-90"
                            />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuIndex === index && (
                            <div className="w-35 absolute left-0 mt-1 bg-white border border-[#543A14] rounded-lg shadow-lg z-10">
                              <ul className="py-2">
                                <li
                                  className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                  onClick={() => {
                                    setSelectedPostId(item.id);
                                    setIsEditPostModalOpen(true);
                                    setOpenMenuIndex(null);
                                  }}
                                >
                                  Ubah Data
                                </li>
                                <li
                                  className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                  onClick={() => {
                                    setSelectedPostId(item.id);
                                    setIsDeletePostModalOpen(true);
                                    setOpenMenuIndex(null);
                                  }}
                                >
                                  Hapus Data
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalData > 0 && (
            <div className="flex justify-end space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-[#543A14] disabled:text-[#C2C2C2]"
              >
                {"< Previous"}
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-[#4A3F35] text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-700 hover:text-gray-900 disabled:text-gray-300"
              >
                Next {">"}
              </button>
            </div>
          )}
        </main>
      )}

      {/* Modal Tambah & Ubah Event */}
      {(isAddPostModalOpen || isEditPostModalOpen) && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px] min-w-135 overflow-y-auto max-h-[90vh]">
            <h1 className="font-bold text-xl">
              {isEditPostModalOpen
                ? "Ubah Data Cabang / Drop Point"
                : "Tambah Cabang / Drop Point"}
            </h1>

            <form onSubmit={handleSubmit(onSubmitPost)}>
              <div className="space-y-3 mb-6">
                <FormInput
                  inputType="text"
                  label="Nama Cabang / Drop Point"
                  placeholder="Contoh: Tempat Penampung B"
                  register={register("nama")}
                  required
                  errors={errors.nama?.message}
                />
                <FormInput
                  inputType="text"
                  label="Nomor Telepon (Whatsapp)"
                  placeholder="Contoh: +6281212312312"
                  register={register("nomorTelepon")}
                  required
                  errors={errors.nomorTelepon?.message}
                />
                <>
                  <FormInput
                    label="Alamat Lengkap"
                    inputType="textArea"
                    placeholder="Contoh: Jl. Tanah Air, Blok. A, No. 1, Alam Sutera"
                    value={watch("alamat.summary") || ""}
                    onClick={() => setIsAddressModalOpen(!isAddressModalOpen)}
                    className="flex-1"
                    required
                    errors={errors?.alamat?.message}
                  />

                  {/* Modal Detail Alamat */}
                  <AddressModal
                    isOpen={isAddressModalOpen}
                    watch={watch}
                    dataProfile={selectedDataPost}
                    handleClose={() => setIsAddressModalOpen(false)}
                    setValue={setValue}
                  />
                </>
                <FormInput
                  label="Tipe"
                  inputType="dropdownInput"
                  name="tipe"
                  options={postTypesList}
                  control={control}
                  placeholder="Pilih tipe tempat yang sesuai"
                  required
                  onChange={(selected) => {
                    setValue("tipe", selected?.value || "");
                  }}
                  errors={errors.tipe?.message}
                />
              </div>

              <div className="flex gap-3">
                <ButtonCustom
                  label={
                    isLoadingCreateUpdatePost ? (
                      <ClipLoader
                        size={20}
                        color="#fff"
                        loading={isLoadingCreateUpdatePost}
                      />
                    ) : isAddPostModalOpen ? (
                      "Tambah"
                    ) : (
                      "Simpan"
                    )
                  }
                  variant="brown"
                  type="submit"
                  className="w-full"
                />
                <ButtonCustom
                  label="Batal"
                  variant="outlineBrown"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    isEditPostModalOpen
                      ? setIsEditPostModalOpen(false)
                      : setIsAddPostModalOpen(false);
                    reset();
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Cabang */}
      {isDeletePostModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={deletePostsModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px] min-w-135 overflow-y-auto max-h-[90vh]"
          >
            <h1 className="font-bold text-xl">
              {`Hapus Data ${selectedDataPost?.type === "BRANCH" ? "Cabang" : "Drop Point"}`}
            </h1>
            <p>
              {selectedDataPost?.type === "BRANCH" ? "Cabang" : "Drop Point"}{" "}
              yang telah di <span className="font-bold">HAPUS</span> akan hilang
              pada tampilan tabel dan tampilan donatur sehingga tidak dapat
              mengirimkan barang donasi ke{" "}
              {selectedDataPost?.type === "BRANCH" ? "cabang" : "drop point"}{" "}
              terkait lagi.{" "}
              <span className="font-bold">
                Apakah Anda yakin ingin menghapusnya?
              </span>
            </p>

            <div>
              <ButtonCustom
                label={
                  isLoadingDeletePost ? (
                    <ClipLoader
                      size={20}
                      color="#fff"
                      loading={isLoadingDeletePost}
                    />
                  ) : (
                    "Hapus"
                  )
                }
                variant="brown"
                className="w-full"
                type="button"
                onClick={onDeletePost}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
