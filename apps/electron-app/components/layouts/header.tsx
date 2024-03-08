"use client";
/*********************************************************************************** */
import { Lora } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
/*********************************************************************************** */
import { ROUTE } from "@/constants/router";
import { classNames } from "@/util/class-name";
/*********************************************************************************** */

const lora = Lora({
  subsets: ["latin"],
  weight: ["700"],
});

export default function Header() {
  const router = useRouter();
  const pathName = usePathname();

  const initNavigation = [
    {
      name: "단일 모듈 시험",
      href: ROUTE.module,
      current: true,
    },
    {
      name: "C-JS API 성능 비교",
      href: ROUTE.performance,
      current: false,
    },
    {
      name: "암-복호화",
      href: ROUTE.endecrypt,
      current: false,
    },
  ];

  const [navigation, setNavigation] = useState(initNavigation);

  useLayoutEffect(() => {
    let nav = initNavigation;
    nav.map((item) => {
      if (item.href === pathName && item.current === false) item.current = true;
      else if (item.current === true && item.href !== pathName)
        item.current = false;
    });
    setNavigation(nav);
  }, [pathName]);

  return (
    <header className="flex w-full bg-indigo-600 px-8 py-4 justify-between items-center">
      {/* 로고 */}
      <div className="flex items-center space-x-4">
        <div
          className={`text-lg font-extrabold ${lora.className} bg-white rounded-lg text-indigo-600 px-3 py-2 hover:text-indigo-400 cursor-pointer select-none`}
          onClick={() => router.push(ROUTE.module)}
        >
          Q-SoC
        </div>
        <p className="text-white select-none">
          {`개발 플랫폼 성능 시험 프로그램 v${process.env.NEXT_PUBLIC_APP_VERSION}`}
        </p>
      </div>
      <nav className="flex items-center text-lg text-white space-x-4">
        {navigation.map((item) => {
          return (
            <div
              key={item.href}
              className={classNames(
                item.current
                  ? "bg-indigo-700"
                  : "hover:bg-indigo-500 hover:bg-opacity-75",
                "px-3 py-2 cursor-pointer text-white text-base rounded-md select-none"
              )}
              onClick={() => router.push(item.href)}
            >
              {item.name}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
