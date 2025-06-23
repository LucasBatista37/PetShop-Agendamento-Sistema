import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className="
              relative w-full h-full
              sm:max-w-2xl sm:h-auto
              bg-white flex flex-col
              rounded-none sm:rounded-lg shadow-xl
              overflow-hidden
            "
          >
            <header
              className="
                sticky top-0 bg-white/95
                px-4 sm:px-6 py-4
                flex items-center justify-between
                rounded-none sm:rounded-t-lg z-10
              "
            >
              <Dialog.Title className="text-xl font-semibold text-gray-800">
                {title}
              </Dialog.Title>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="p-2 rounded hover:bg-gray-100 text-gray-500"
              >
                ×
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              {children}
            </div>

            {footer && (
              <footer
                className="
                  sticky bottom-0 bg-white/95
                  px-4 sm:px-6 py-4
                  flex justify-end space-x-2
                  rounded-none sm:rounded-b-lg
                "
              >
                {footer}
              </footer>
            )}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
