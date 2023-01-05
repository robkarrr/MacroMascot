import { createContext, useContext, useState, useEffect } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	updateProfile,
	updatePassword,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import {
	setDoc,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";


const AuthContext = createContext();

const useAuthContext = () => {
	return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const [userName, setUserName] = useState(null);
	const [userImageUrl, setUserImageUrl] = useState(null);
	const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(null);


	// skapa användare
	const signup = async (email, password, lastname, name) => {
		await createUserWithEmailAndPassword(auth, email, password);
		await setDisplayName(name);
		await reloadUser();
		const docRef = doc(db, "users", auth.currentUser.uid);

		await setDoc(docRef, {
			email,
            lastname,
			name,
		});
	};


	//login / logout
	const login = async (email, password) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const logout = () => {
		return signOut(auth);
	};

	const setDisplayName = async (displayName) => {

		//update the user
		return updateProfile(auth.currentUser, {
			displayName,
		});
	};

	
	//update password
	const updateUserPassword = async (newPassword) => {
		try{
			await updatePassword(auth.currentUser, newPassword);
		}
		catch(err){
			console.log(err);
		}
	};

	const reloadUser = async () => {
		await auth.currentUser.reload();
		setCurrentUser(auth.currentUser);
		setUserName(auth.currentUser.displayName);
		setUserEmail(auth.currentUser.email);
		return true;
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setCurrentUser(user);

			if (user) {
				const ref = doc(db, "users", user.uid);
				const snapshot = await getDoc(ref);

                setIsAdmin(snapshot.data()?.admin);


				setUserEmail(user.email);
			}
			setLoading(false);
		});

		return unsubscribe;
	}, []);


	const contextValues = {
		currentUser,
		setDisplayName,
		signup,
		login,
		logout,
		reloadUser,
		userName,
        isAdmin,
		updateUserPassword,
	};

	return (
		<AuthContext.Provider value={contextValues}>
			{loading ? (
				<div>
					Loading...
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	);
};

export { AuthContextProvider as default, useAuthContext };