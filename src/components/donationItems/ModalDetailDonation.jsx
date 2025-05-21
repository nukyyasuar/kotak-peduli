import { useState, useRef } from "react";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

import { ButtonCustom } from "src/components/button";
import { TextBetween, ListTextWithTitle } from "src/components/text";
import AttachmentImage from "src/components/attachmentImage";
import {
  statusList,
  donationTypes,
  shippingTypes,
} from "src/components/options";
import FormattedWIBDate from "src/components/dateFormatter";
import handleOutsideModal from "src/components/handleOutsideModal";

const ModalDetailDonation = ({
  isOpen,
  detailModalRef,
  imgSrc,
  setImgSrc,
  handleImageLoaded,
  setIsShippingDateModalOpen,
  setIsUpdateStatusModalOpen,
  STATUS_GREEN,
  STATUS_RED,
  detailDonation,
  isFetchDetailDonationLoading,
  userRole,
}) => {
  const largeImageModalRef = useRef(null);
  const [isModalLargeImageOpen, setIsModalLargeImageOpen] = useState(false);
  const distributionProofModalRef = useRef(null);
  const [isDistributionProofModalOpen, setIsDistributionProofModalOpen] =
    useState(false);

  const latestStatus = detailDonation?.approvals?.latestStatus;
  const statusGreenDetailDonation = STATUS_GREEN.includes(latestStatus);
  const statusRedDetailDonation = STATUS_RED.includes(latestStatus);
  const statusColor = statusGreenDetailDonation
    ? "bg-[#1F7D53]"
    : statusRedDetailDonation
      ? "bg-[#E52020]"
      : "bg-[#543A14]";
  const shelterShippingDate = detailDonation?.pickupDate;
  const donorShippingDate = detailDonation?.userAvailability;
  const rejectedRedirectedNote =
    detailDonation?.approvals?.approvalDetails?.find(
      (item) => item.status === "REJECTED" || item.status === "REDIRECTED"
    )?.notes;

  handleOutsideModal({
    ref: isDistributionProofModalOpen
      ? distributionProofModalRef
      : largeImageModalRef,
    isOpen: isDistributionProofModalOpen || isModalLargeImageOpen,
    onClose: () => {
      if (isDistributionProofModalOpen) {
        setIsDistributionProofModalOpen(false);
      }
      if (isModalLargeImageOpen) {
        setIsModalLargeImageOpen(false);
      }
    },
  });

  if (!isOpen || !detailDonation) return null;
  return (
    <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
      <div
        ref={detailModalRef}
        className="bg-white rounded-lg p-8 space-y-6 text-black max-h-[90vh] overflow-y-auto"
      >
        {isFetchDetailDonationLoading ? (
          <div className="flex items-center justify-center w-120 h-120">
            <ClipLoader
              color="#543A14"
              loading={isFetchDetailDonationLoading}
              size={50}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-xl">
                Detail Riwayat Barang Donasi
              </h1>
              <span
                className={`${statusColor} text-white px-6 py-2 font-bold rounded-lg`}
              >
                {statusList.find((status) => status.value === latestStatus)
                  ?.label || latestStatus}
              </span>
            </div>

            <div className="flex space-x-8">
              {/* Left Section */}
              <div className="w-80 space-y-6">
                <div className="space-y-6">
                  {/* Large Image */}
                  <div
                    className="bg-[#C2C2C2] aspect-square rounded-lg relative"
                    onClick={() => setIsModalLargeImageOpen(true)}
                  >
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt="Donation item image large"
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : null}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-scroll no-scrollbar">
                    {detailDonation?.attachments?.files?.map((file, index) => (
                      <div
                        key={index}
                        className="bg-[#C2C2C2] rounded-lg min-w-16 aspect-square relative"
                      >
                        <AttachmentImage
                          index={index}
                          fileName={file.name}
                          onSelect={(src) => setImgSrc(src)}
                          onLoad={handleImageLoaded}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Large Image When Clicked */}
                {isModalLargeImageOpen && (
                  <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
                    <div
                      ref={largeImageModalRef}
                      className="bg-white rounded-lg p-8 space-y-6 text-black max-h-[90vh] overflow-y-auto"
                    >
                      <div className="w-130 space-y-6">
                        <div className="space-y-6">
                          {/* Large Image */}
                          <div className="bg-[#C2C2C2] aspect-square rounded-lg relative">
                            {imgSrc ? (
                              <Image
                                src={imgSrc}
                                alt="Donation item image large"
                                fill
                                className="object-cover rounded-lg"
                              />
                            ) : null}
                          </div>

                          {/* Thumbnails */}
                          <div className="flex gap-2 overflow-scroll no-scrollbar">
                            {detailDonation?.attachments?.files?.map(
                              (file, index) => (
                                <div
                                  key={index}
                                  className="bg-[#C2C2C2] rounded-lg min-w-16 aspect-square relative"
                                >
                                  <AttachmentImage
                                    index={index}
                                    fileName={file.name}
                                    onSelect={(src) => setImgSrc(src)}
                                    onLoad={handleImageLoaded}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="space-y-2">
                  {userRole !== "admin" && (
                    <ButtonCustom
                      variant="outlineOrange"
                      type="button"
                      label="Hubungi Tempat Penampung"
                      className="w-full"
                    />
                  )}
                  {(() => {
                    if (latestStatus === "DIGITAL_CHECKING") return null;

                    const showButton = () => {
                      if (userRole === "admin") {
                        if (latestStatus === "CONFIRMING") return true;
                      } else {
                        if (latestStatus === "PENDING") return true;
                        if (latestStatus === "CONFIRMED") return true;
                      }
                      return false;
                    };

                    const buttonLabel = (() => {
                      if (userRole === "admin") {
                        return shelterShippingDate
                          ? "Pilih Ulang Tanggal Pengiriman"
                          : "Pilih Tanggal Pengiriman";
                      } else {
                        return shelterShippingDate
                          ? "Atur ulang opsi tanggal"
                          : "Atur opsi tanggal pengiriman";
                      }
                    })();

                    return (
                      showButton() && (
                        <ButtonCustom
                          variant="orange"
                          type="button"
                          label={buttonLabel}
                          className="w-full"
                          onClick={() => setIsShippingDateModalOpen(true)}
                        />
                      )
                    );
                  })()}
                  {latestStatus === "DISTRIBUTED" && (
                    <ButtonCustom
                      variant="orange"
                      type="button"
                      label="Lihat Bukti Penyaluran"
                      className="w-full"
                      onClick={() => setIsDistributionProofModalOpen(true)}
                    />
                  )}
                  {userRole === "admin" &&
                    latestStatus !== "PENDING" &&
                    latestStatus !== "CONFIRMING" &&
                    latestStatus !== "CONFIRMED" &&
                    latestStatus !== "DISTRIBUTED" &&
                    latestStatus !== "REJECTED" && (
                      <ButtonCustom
                        variant="brown"
                        type="button"
                        label="Ubah Status"
                        className="w-full"
                        onClick={() => setIsUpdateStatusModalOpen(true)}
                      />
                    )}
                </div>
              </div>

              {/* Right Section */}
              <div className="space-y-4 max-w-[450px]">
                {rejectedRedirectedNote && (
                  <ListTextWithTitle
                    title="Alasan Penolakan:"
                    values={[rejectedRedirectedNote]}
                    className="max-w-[450px] text-red-600"
                  />
                )}
                <ListTextWithTitle
                  title="Tanggal Donasi:"
                  values={[
                    <FormattedWIBDate
                      date={detailDonation?.createdAt}
                      type="time"
                    />,
                  ]}
                />
                <ListTextWithTitle
                  title="Informasi Donatur:"
                  values={[
                    `${detailDonation.user.firstName} ${detailDonation.user.lastName}`,
                    detailDonation.user.phoneNumber,
                    `${detailDonation.address.reference ? `(${detailDonation.address.reference}) ` : ""}${detailDonation.address.detail}`,
                  ]}
                  className="max-w-[450px]"
                />
                <ListTextWithTitle
                  title="Barang Donasi:"
                  values={[
                    `${donationTypes.find((type) => type.value === detailDonation.donationType)?.label || detailDonation.donationType} (${detailDonation.quantity}pcs, ${detailDonation.weight}kg)`,
                  ]}
                />
                <ListTextWithTitle
                  title="Detail Tempat Penampung:"
                  values={[
                    detailDonation.collectionCenter.name,
                    detailDonation.post.name,
                    `(${detailDonation.targetAddress.reference}) ${detailDonation.targetAddress.detail}`,
                    <TextBetween
                      label="Event"
                      value={detailDonation.event?.name}
                    />,
                  ]}
                  className="max-w-[450px]"
                />
                <ListTextWithTitle
                  title="Informasi Pengiriman:"
                  values={[
                    shippingTypes.find(
                      (type) => type.value === detailDonation.pickupType
                    )?.label || detailDonation.pickupType,
                    <TextBetween
                      label="Tanggal Pengajuan"
                      value={
                        donorShippingDate.length > 0 &&
                        latestStatus === "CONFIRMING" ? (
                          donorShippingDate.map((date, index) => (
                            <span key={index}>
                              <FormattedWIBDate date={date} type="time" />
                            </span>
                          ))
                        ) : (
                          <span className="font-bold text-[#F0BB78] text-end text-nowrap">
                            {latestStatus === "DIGITAL_CHECKING"
                              ? "Proses pemeriksaan digital"
                              : latestStatus === "PENDING"
                                ? "Donatur belum mengirim opsi"
                                : "-"}
                          </span>
                        )
                      }
                      className="border-b border-[#C2C2C2] pb-1"
                    />,
                    <TextBetween
                      label="Tanggal Konfirmasi Tempat Penampung"
                      value={
                        <span
                          className={`font-bold ${shelterShippingDate ? "text-black" : "text-[#F0BB78]"} text-end`}
                        >
                          {latestStatus === "DIGITAL_CHECKING" ? (
                            "Proses pemeriksaan digital"
                          ) : latestStatus === "PENDING" ? (
                            "Donatur belum mengirim opsi"
                          ) : latestStatus === "CONFIRMING" ? (
                            "Tempat penampung belum memilih"
                          ) : (
                            <FormattedWIBDate
                              date={shelterShippingDate}
                              type="time"
                            />
                          )}
                        </span>
                      }
                      textClassName="justify-end text-end w-full"
                    />,
                  ]}
                />
              </div>
            </div>
          </>
        )}

        {/* Modal Bukti Penyaluran */}
        {isDistributionProofModalOpen && (
          <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
            <div
              ref={distributionProofModalRef}
              className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px]"
            >
              <div className="space-y-5">
                <div className="space-y-3">
                  <h1 className="font-bold text-xl">
                    Laporan Bukti Penyaluran
                  </h1>
                  <p>
                    Berikut adalah bukti penyaluran dalam bentuk foto dan
                    laporan terkait penyaluran barang donasi yang telah
                    dilakukan oleh tempat penampung ke pihak yang membutuhkan.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg relative w-full aspect-[5/3] overflow-hidden">
                    {detailDonation?.proofs?.files[0] ? (
                      <Image
                        src={detailDonation?.proofs?.files[0]?.path}
                        alt={detailDonation?.proofs?.files[0]?.name}
                        fill
                        className="object-contain object-center rounded-lg"
                      />
                    ) : null}
                  </div>
                  <span className="font-bold text-lg">Laporan Singkat:</span>
                  <p>
                    {
                      detailDonation?.approvals?.approvalDetails?.find(
                        (item) => item.status === "DISTRIBUTED"
                      )?.notes
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDetailDonation;
