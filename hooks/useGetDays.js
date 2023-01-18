import { useAuthContext } from "../context/AuthContext"
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection } from '@firebase/firestore'
import { db } from '../firebase'

const useGetDays = () => {
    const { currentUser } = useAuthContext()
    const query = collection(db, `users/${currentUser.uid}/days`)
    const [docs, loading, error] = useCollectionData(query)

    return {
        docs,
        loading,
        error
    }
}

export default useGetDays