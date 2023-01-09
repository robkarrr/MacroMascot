import useStreamDocument from "./useStreamDocument"

const useGetUser = (id) => {
	return useStreamDocument('users', id)
}

export default useGetUser