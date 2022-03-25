import React, { useEffect, useState } from 'react'
import { JournalScreen } from '../components/journal/JournalScreen'
import { AuthRouter } from './AuthRouter'
import {
	BrowserRouter as Router,
	Switch,
} from 'react-router-dom'
import { firebase } from '../firebase/firebase-config'
import { useDispatch } from 'react-redux'
import { login } from '../actions/auth'
import { PublicRoute } from './PublicRoute'
import { PrivateRoute } from './PrivateRoute'
import { startLoadingNotes } from '../actions/notes'

export const Approuter = () => {
	const dispatch = useDispatch()

	const [ checking, setChecking ] = useState( true )
	const [ isLoggedIn, setIsLoggedIn ] = useState( false )


	useEffect( () => {    
		firebase.auth().onAuthStateChanged( async ( user ) => {
			if ( user?.uid ) {
				dispatch( login( user.uid, user.displayName ) )
				setIsLoggedIn( true )

				dispatch( startLoadingNotes ( user.uid ) )

			} else {
				setIsLoggedIn( false ) 
			}

			setChecking( false )
		} )
	}, [ dispatch, setChecking, setIsLoggedIn ] )

	if( checking ){
		return(
			<h1>Espere...</h1>
		)
	}
    
	return (
		<Router>
			<div>
				<Switch>     

					<PublicRoute 
						path="/auth"
						component={ AuthRouter } 
						isAuthenticated={ isLoggedIn }
					/>
					<PrivateRoute 
						exact
						path="/"
						component={ JournalScreen } 
						isAuthenticated={ isLoggedIn }
					/>
				</Switch>
			</div>
		</Router>
	)
}


