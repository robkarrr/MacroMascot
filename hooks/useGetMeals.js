import { useAuthContext } from "../context/AuthContext"
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection } from '@firebase/firestore'
import { db } from '../firebase'
import { useState, useEffect } from 'react'
const useGetMeals = () => {
    const { currentUser } = useAuthContext()
    const query = collection(db, `users/${currentUser.uid}/meals`)
    const [docs, loading, error] = useCollectionData(query)

    return {
        docs,
        loading,
        error
    }
}

export default useGetMeals