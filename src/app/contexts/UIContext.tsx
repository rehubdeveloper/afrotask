'use client'
import { createContext, useContext, useState } from 'react'

interface UIContextType {
    isRestrictedModalOpen: boolean;
    restrictedFeature: string;
    showRestrictedModal: (feature: string) => void;
    hideRestrictedModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export const useUI = () => {
    const context = useContext(UIContext)
    if (!context) {
        throw new Error('useUI must be used within a UIProvider')
    }
    return context
}

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
    const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false)
    const [restrictedFeature, setRestrictedFeature] = useState('')

    const showRestrictedModal = (feature: string) => {
        setRestrictedFeature(feature)
        setIsRestrictedModalOpen(true)
    }

    const hideRestrictedModal = () => {
        setIsRestrictedModalOpen(false)
        setRestrictedFeature('')
    }

    const value = {
        isRestrictedModalOpen,
        restrictedFeature,
        showRestrictedModal,
        hideRestrictedModal
    }

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    )
}
