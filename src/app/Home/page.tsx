"use client";

import Loader from "@/components/common/loader";
import { auth, firestore } from "@/firebase/config";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Modal from "../../components/common/modal";
import Navbar from '../../components/common/Navbar';
import CustomizeLinks from "../../components/CustomizeLinks";
import DisplayLink from "../../components/DisplayLink";
import ProfileDetails from "../../components/ProfileDetails";

export default function Home() {
  type ModalMessage = {
    show: boolean;
    message: string;
  }
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const MemorizedNavbar = React.memo(Navbar);
  const MemorizedDisplayLink = React.memo(DisplayLink);
  const MemorizedProfileDetails = React.memo(ProfileDetails);
  const MemorizedCustomizeLinks = React.memo(CustomizeLinks);
  const [selectedComponent, setSelectedComponent] = useState<'customize' | 'profile'>('customize');
  const [savedProfile, setSavedProfile] = useState(false);
  const router = useRouter();
  const [accountInfo, setAccountInfo] = useState<ModalMessage>({
    show: false,
    message: ''
  })

  const handleNavClick = (component: 'customize' | 'profile') => {
    setSelectedComponent(component);
  };

  const handleSavedProfile = () => {
    setSavedProfile(true);
  };

  useEffect(() => {
    if (savedProfile) {
      const timeoutId = setTimeout(() => setSavedProfile(false), 4000);
      return () => clearTimeout(timeoutId);
    }
  }, [savedProfile]);

  useEffect(() => {
    if (!accountInfo.show) return;

    const timeoutId = setTimeout(() => {
      setAccountInfo({
        show: false,
        message: ''
      });
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [accountInfo.show]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     setLoading(true);

  //     if (user) {
  //       setUser(user);
  //       const userDoc = await getDoc(doc(firestore, "users", user.uid));

  //       if (userDoc.exists()) {
  //         const userData = userDoc.data()
  //         setUserEmail(`${userData.email}`)
  //       } else {
  //         router.push("/")
  //       }
  //     }
  //     setLoading(false)
  //   });

  //   return () => unsubscribe();
  // }, [router]);

  // if (loading) return <Loader />;

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth)
  //     router.push("/")
  //   } catch (e) {
  //     setAccountInfo({
  //       show: true,
  //       message: "Failed to log out"
  //     })
  //   }
  // }

  return (
    <main className="w-full">
      {/* {user ? (
        <> */}
          <MemorizedNavbar onNavClick={handleNavClick} />
          <section className="flex w-full">
            <MemorizedDisplayLink />
            {selectedComponent === 'customize' && (
              <MemorizedCustomizeLinks savedProfile={savedProfile} setSavedProfile={handleSavedProfile} />
            )}
            {selectedComponent === 'profile' && (
              <MemorizedProfileDetails savedProfile={savedProfile} setSavedProfile={handleSavedProfile} />
            )}
          </section>
          {savedProfile && (
            <Modal>
              <div className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clipPath="url(#clip0_112_995)">
                    <path d="M19.5 3.00001H17.625C17.5256 3.00001 17.4302 3.03952 17.3598 3.10984C17.2895 3.18017 17.25 3.27555 17.25 3.37501V7.50001C17.25 7.89783 17.092 8.27936 16.8107 8.56067C16.5294 8.84197 16.1478 9.00001 15.75 9.00001H8.27532C8.08145 9.00309 7.89362 8.93253 7.74973 8.80256C7.60584 8.67259 7.5166 8.49288 7.50001 8.2997C7.4932 8.1971 7.50755 8.09421 7.54218 7.9974C7.57681 7.90059 7.63097 7.81194 7.70131 7.73694C7.77164 7.66195 7.85664 7.60222 7.95104 7.56146C8.04543 7.5207 8.14719 7.49978 8.25001 7.50001H15.375C15.4745 7.50001 15.5698 7.4605 15.6402 7.39017C15.7105 7.31985 15.75 7.22446 15.75 7.12501V3.37501C15.75 3.27555 15.7105 3.18017 15.6402 3.10984C15.5698 3.03952 15.4745 3.00001 15.375 3.00001H8.56032C8.36326 2.99938 8.16805 3.03792 7.98602 3.11341C7.804 3.18889 7.63879 3.2998 7.50001 3.43969L3.43969 7.50001C3.2998 7.63879 3.18889 7.804 3.11341 7.98602C3.03792 8.16805 2.99938 8.36326 3.00001 8.56032V19.5C3.00001 19.8978 3.15804 20.2794 3.43935 20.5607C3.72065 20.842 4.10218 21 4.50001 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.50001C21 4.10218 20.842 3.72065 20.5607 3.43935C20.2794 3.15804 19.8978 3.00001 19.5 3.00001ZM12 17.25C11.4067 17.25 10.8266 17.0741 10.3333 16.7444C9.83995 16.4148 9.45543 15.9462 9.22837 15.3981C9.00131 14.8499 8.9419 14.2467 9.05765 13.6647C9.17341 13.0828 9.45913 12.5482 9.87869 12.1287C10.2982 11.7091 10.8328 11.4234 11.4147 11.3077C11.9967 11.1919 12.5999 11.2513 13.1481 11.4784C13.6962 11.7054 14.1648 12.0899 14.4944 12.5833C14.8241 13.0766 15 13.6567 15 14.25C15 15.0457 14.6839 15.8087 14.1213 16.3713C13.5587 16.9339 12.7957 17.25 12 17.25Z" fill="white" />
                    <path d="M16.25 2.50001H14.6875C14.6046 2.50001 14.5251 2.53293 14.4665 2.59154C14.4079 2.65014 14.375 2.72963 14.375 2.81251V6.25001C14.375 6.58153 14.2433 6.89947 14.0089 7.13389C13.7745 7.36831 13.4565 7.50001 13.125 7.50001H6.8961C6.73454 7.50258 6.57801 7.44378 6.45811 7.33547C6.3382 7.22716 6.26383 7.0774 6.25001 6.91641C6.24433 6.83092 6.25629 6.74518 6.28515 6.6645C6.31401 6.58383 6.35914 6.50995 6.41776 6.44745C6.47637 6.38496 6.5472 6.33518 6.62586 6.30121C6.70452 6.26725 6.78933 6.24982 6.87501 6.25001H12.8125C12.8954 6.25001 12.9749 6.21708 13.0335 6.15848C13.0921 6.09987 13.125 6.02039 13.125 5.93751V2.81251C13.125 2.72963 13.0921 2.65014 13.0335 2.59154C12.9749 2.53293 12.8954 2.50001 12.8125 2.50001H7.1336C6.96939 2.49948 6.80671 2.5316 6.65502 2.59451C6.50333 2.65741 6.36566 2.74983 6.25001 2.86641L2.86641 6.25001C2.74983 6.36566 2.65741 6.50333 2.59451 6.65502C2.5316 6.80671 2.49948 6.96939 2.50001 7.1336V16.25C2.50001 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75001C17.5 3.41849 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.50001 16.25 2.50001ZM10 14.375C9.50555 14.375 9.0222 14.2284 8.61108 13.9537C8.19996 13.679 7.87953 13.2885 7.69031 12.8317C7.50109 12.3749 7.45158 11.8722 7.54804 11.3873C7.64451 10.9023 7.88261 10.4569 8.23224 10.1072C8.58187 9.75761 9.02733 9.51951 9.51228 9.42304C9.99723 9.32658 10.4999 9.37609 10.9567 9.56531C11.4135 9.75453 11.804 10.075 12.0787 10.4861C12.3534 10.8972 12.5 11.3806 12.5 11.875C12.5 12.538 12.2366 13.1739 11.7678 13.6428C11.2989 14.1116 10.663 14.375 10 14.375Z" fill="#737373" />
                  </g>
                  <defs>
                    <clipPath id="clip0_112_995">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="sm:text-[12px] sm:text-center text-base">Your changes have been successfully saved!</p>
              </div>
            </Modal>
          )}
          {accountInfo.show && <Modal>
            <div className="flex">
              <p className="sm:text-[12px] sm:text-center text-base">{accountInfo.message}</p>
            </div>
          </Modal>}
        {/* </>
      ) : null} */}
    </main>
  );
}