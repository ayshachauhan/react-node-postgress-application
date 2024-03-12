'use client';
import React, { useState } from 'react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen ? (
        <div
          className="fixed lg:relative inset-y-0 left- w-64 text-transparent bg-gradient-to-b from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 
          'translate-x-0"
        >
          <div className="p-4">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16 9V4h-1V2H5v2H4v5H2v1h2v7h13v-7h2V9h-2zM6 4h8v5H6V4z" />
                  </svg>
                  <span className="ml-2">Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 5H7v2h6V5zM7 15h6v-2H7v2zm-4-4h2v-2H3V7H1v4a2 2 0 0 0 2 2zM17 3h-2V1H5v2H3v5h2v2H3v8h14v-8h-2v-2h2V3z" />
                  </svg>
                  <span className="ml-2">Settings</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 5H7v2h6V5zM7 15h6v-2H7v2zm-4-4h2v-2H3V7H1v4a2 2 0 0 0 2 2zM17 3h-2V1H5v2H3v5h2v2H3v8h14v-8h-2v-2h2V3z" />
                  </svg>
                  <span className="ml-2">Profile</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 5H7v2h6V5zM7 15h6v-2H7v2zm-4-4h2v-2H3V7H1v4a2 2 0 0 0 2 2zM17 3h-2V1H5v2H3v5h2v2H3v8h14v-8h-2v-2h2V3z" />
                  </svg>
                  <span className="ml-2">Messages</span>
                </a>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            className="mb-100 text-white bg-transparent hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center  items-center me-2 right-0  absolute inline-block bottom-0  "
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className="fixed lg:relative inset-y-0 left-  text-transparent bg-gradient-to-b from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
           w-14  transition-all duration-300"
        >
          <div className="p-4">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16 9V4h-1V2H5v2H4v5H2v1h2v7h13v-7h2V9h-2zM6 4h8v5H6V4z" />
                  </svg>
                  {/* <span className="ml-2">Dashboard</span> */}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 5H7v2h6V5zM7 15h6v-2H7v2zm-4-4h2v-2H3V7H1v4a2 2 0 0 0 2 2zM17 3h-2V1H5v2H3v5h2v2H3v8h14v-8h-2v-2h2V3z" />
                  </svg>
                  {/* <span className="ml-2">Settings</span> */}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 5H7v2h6V5zM7 15h6v-2H7v2zm-4-4h2v-2H3V7H1v4a2 2 0 0 0 2 2zM17 3h-2V1H5v2H3v5h2v2H3v8h14v-8h-2v-2h2V3z" />
                  </svg>
                  {/* <span className="ml-2">Profile</span> */}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 5H7v2h6V5zM7 15h6v-2H7v2zm-4-4h2v-2H3V7H1v4a2 2 0 0 0 2 2zM17 3h-2V1H5v2H3v5h2v2H3v8h14v-8h-2v-2h2V3z" />
                  </svg>
                  {/* <span className="ml-2">Messages</span> */}
                </a>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            className="mb-100 text-white bg-transparent hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center  items-center me-2 right-0  absolute inline-block bottom-0  "
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
