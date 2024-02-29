import SchoolsMap from '../MapView/SchoolsMap';
import VotersList from '../Apis/VotersList';
import { Routes, Route, NavLink } from 'react-router-dom';

const LoadHome = () => {
    return (
        <>
            <div>
                <ul>
                    <li>
                        <NavLink aria-current="page" to="/Voters">VOTE NOW</NavLink>
                    </li>
                </ul>
            </div>
            <Routes >

                <Route path='/Voters' element={<VotersList />} />
                <Route path='/Voters/:school_coordinates' element={<SchoolsMap />} />


            </Routes >
        </>




    )
}

export default LoadHome;