import { useState } from "react";

export function useModal() {
  // 성능 측정 구간 상세 모달
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  // 장치 검색 모달
  const [isSearchDeviceModalOpen, setIsSearchDeviceModalOpen] =
    useState<boolean>(false);

  // 성능 측정 구간 상세 모달 생성
  const openDetailModal = () => setIsDetailModalOpen(true);
  // 성능 측정 구간 상세 모달 닫기
  const closeDetailModal = () => setIsDetailModalOpen(false);

  // 장치 검색 모달 생성
  const openDeviceModal = () => setIsSearchDeviceModalOpen(true);
  // 장치 검색 모달 닫기
  const closeDeviceModal = () => setIsSearchDeviceModalOpen(false);

  return {
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    isSearchDeviceModalOpen,
    openDeviceModal,
    closeDeviceModal,
  };
}
