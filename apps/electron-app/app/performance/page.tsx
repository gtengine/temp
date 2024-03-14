"use client";

import { ChartData } from "chart.js";
import { useEffect, useState } from "react";
/*********************************************************************************** */
import ListboxSet from "@/components/listbox";
import PerformanceChart from "@/components/perf-chart";
import SelectLanguage from "@/components/test-item-setting/select-language";
import SelectMode from "@/components/test-item-setting/select-test-mode";
import { apis } from "@/constants/api-list";
import { useTest } from "@/hook/use-test";
import { classNames } from "@/util/class-name";
import FlowChart from "@/components/flow-chart";
import MeasurementSectionDetailModal from "@/components/modals/measurement-detail";
import { useModal } from "@/hook/use-modal";
import DeviceListModal from "@/components/modals/device-list";
import { useDevice } from "@/hook/use-device";
import { USBDeviceInfo } from "@qsoc/js-api/dist/types/device";

//  단일 모듈 시험 페이지
export default function Home() {
  // 장치 정보
  const { device, setDevice, deviceList, setDeviceList } = useDevice();

  // 시험 항목
  const {
    language,
    setLanguage,
    api,
    setApi,
    mode,
    setMode,
    modeOption,
    setModeOption,
  } = useTest();

  const {
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    isSearchDeviceModalOpen,
    openDeviceModal,
    closeDeviceModal,
  } = useModal();

  // console.log(language);
  // console.log(api);
  // console.log(modeOption);

  // 시험 결과 데이터
  const data: ChartData<"bar"> = {
    labels: ["1KB", "2KB", "4KB", "8KB", "16KB", "32KB", "64KB", "128KB"],
    datasets: [
      {
        label: "loopback",
        data: [1.67, 3.3, 6.5, 13.7, 23.7, 50.5, 80.6, 108.7],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // 시험 결과 성패 갯수
  const resultStatus = {
    success: 100,
    failure: 0,
  };

  // 메인에서 USB 장치 리스트 수신
  useEffect(() => {
    window.device.responseDeviceList((message: USBDeviceInfo[]) => {
      setDeviceList(message);
    });
  }, []);

  // USB 장치 리스트 요청
  const reqDeviceList = () => {
    window.device.requestDeviceList("request from renderer");
  };

  // 장치 검색 버튼 클릭 핸들러
  const onClickDeviceButtonHandler = () => {
    reqDeviceList();
    openDeviceModal();
  };

  return (
    <main className="">
      <div className="outer">
        {/* 장치 선택 */}
        <section className="left--container">
          <div className="flex w-full items-center justify-between">
            <h2 className="font-bold">장치 선택</h2>
            <button
              onClick={onClickDeviceButtonHandler}
              className="btn--theme text-sm py-1"
            >
              장치 검색
            </button>
          </div>

          <div className="contents--container flex flex-col w-full justify-end text-sm">
            {Object.entries(device).map(([key, value], index) => {
              return (
                <div key={key} className="flex">
                  <div
                    className={classNames(
                      index === Object.entries(device).length - 1
                        ? "border-b-[1px]"
                        : null,
                      "w-1/2 px-3 py-2 font-bold bg-gray-200 border-t-[1px] border-l-[1px] border-gray-400 flex items-center"
                    )}
                  >
                    {key}
                  </div>
                  <div
                    className={classNames(
                      index === Object.entries(device).length - 1
                        ? "border-b-[1px]"
                        : null,
                      "w-1/2 px-3 py-2 border-t-[1px] border-r-[1px] border-gray-400"
                    )}
                  >
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 성능 측정 구간 간소화 이미지 */}
        <section className="right--container">
          <h2 className="font-bold">성능 측정 구간</h2>
          <div className="pl-8 flex w-full h-full items-center justify-center">
            <FlowChart language={language} />
          </div>
        </section>
      </div>

      <div className="outer">
        {/* 시험 항목 설정 */}
        <section className="left--container">
          <h2 className="font-bold">시험 항목 설정</h2>
          <div className="space-y-4 contents--container">
            {/* 언어 선택 및 버전 출력 */}
            <SelectLanguage setLanguage={setLanguage} />
            {/* API 기능 선택 */}
            <ListboxSet dataSet={apis} setApi={setApi} />

            <hr className="border border-gray-300" />

            {/* 시험 모드 선택 */}
            <SelectMode
              mode={mode}
              setMode={setMode}
              setModeOption={setModeOption}
            />

            <hr className="border border-gray-300" />

            {/* 실행 버튼 */}
            <button className="w-full btn--theme py-2">실행</button>
          </div>
        </section>

        {/* 시험 결과 */}
        <section className="right--container">
          <h2 className="font-bold">시험 결과</h2>

          <div className="contents--container flex h-full items-center">
            {/* 시험 결과 차트 */}
            <div className="w-full h-full flex items-center border shadow-md">
              <PerformanceChart data={data} />
            </div>
          </div>
        </section>
      </div>

      <div className="outer">
        {/* 시험 작동 결과 상태 */}
        <section className="left--container">
          <h2 className="min-w-fit font-bold">시험 결과 상태</h2>
          <div className="flex w-full justify-center">
            <div className="pt-2">
              {Object.entries(resultStatus).map(([key, value]) => (
                <div key={key} className="flex space-x-3">
                  <p
                    className={classNames(
                      `${key}` === "success"
                        ? "text-green-400"
                        : "text-red-500",
                      "font-semibold w-16"
                    )}
                  >{`${key}`}</p>
                  <p>:</p>
                  <p>{`${value}`}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* 모달 생성 및 시험 결과 csv 저장 */}
        <section className="right--container space-x-6 flex justify-end items-end">
          <button className="btn--theme py-1" onClick={openDetailModal}>
            성능 측정 구간 상세
          </button>
          <button className="btn--theme py-1">.csv 저장</button>
        </section>
      </div>
      {isDetailModalOpen && (
        <MeasurementSectionDetailModal
          onClose={closeDetailModal}
          language={language}
        />
      )}
      {isSearchDeviceModalOpen && (
        <DeviceListModal
          onClose={closeDeviceModal}
          deviceList={deviceList}
          setDevice={setDevice}
        />
      )}
    </main>
  );
}
