import { useState, useEffect } from "react"
import '../Apis/schools.css';
import { NavLink } from 'react-router-dom';



const VotersList = () => {

    const [data, setData] = useState([]);
    const [filteredList, setFilteredList] = useState(data);


    useEffect(() => {
        const getSchools = async () => {
            const response = await fetch('http://localhost:5001/schoolsdata', {
                method: 'GET',

            })

            setData(await response.json());


        }
        getSchools();

    }, [])


    const onFormSubmit = (event) => {
        event.preventDefault();

    }

    function convertObject(obj) {
        return Object.values(obj)
    }



    const filterBySearch = (event) => {
        // Access input value
        const query = event.target.value;
        // Create copy of voter list
        var updatedList = [...data];
        // Include all elements which includes the search query
        updatedList = updatedList.filter((voter) => {
            return voter.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
        // Trigger render with updated values
        setFilteredList(updatedList);
    };
    return (
        <div className="App">
            <div className="search-header">
                <div className="search-text">Search:</div>
                <input placeholder="VOTER NAME" id="search-box" onChange={filterBySearch} />
            </div>
            <div id="voter-list">
                <ol>

                    {filteredList.map((voter, index) => (
                        <>
                            <div key={voter._id}>
                                <form onSubmit={onFormSubmit}>
                                    <div >
                                        <div >
                                            <h3 className="user-container">Voter Name:&nbsp;{voter.name}...</h3>
                                        


                                            <h5>National ID:&nbsp;{voter.nationalID}</h5>
                                            <NavLink to={`/Voters/${convertObject(voter.location.coordinates)}`}>
                                                MAP
                                            </NavLink>



                                        </div>
                                    </div>
                                </form>

                            </div>
                        </>
                    ))}
                </ol>


            </div>
        </div>

    );




}



export default VotersList;