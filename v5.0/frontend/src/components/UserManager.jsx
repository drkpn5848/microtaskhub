import React, { useEffect, useRef, useState } from 'react';
import './UserManager.css';
import ProgressBar from './ProgressBar';
import { apibaseurl, callApi, imgurl } from '../lib';

const UserManager = ({logout}) => {
    const [data, setData] = useState(null);
    const [token, setToken] = useState("");
    const [isProgress, setIsProgress] = useState("");
    const [activePage, setActivePage] = useState(0);
    const contentDiv = useRef();

    useEffect(()=>{
        const storedtoken = localStorage.getItem("token");
        if(storedtoken == undefined || storedtoken == "")
            return logout();
            
        const ps = Math.floor((contentDiv.current.offsetHeight - 40) / 40);
        setToken(storedtoken);
        setIsProgress(true);
        callApi("GET", apibaseurl + "/authservice/getallusers/1/" + 2, null, null, loadData, storedtoken);
    },[]);

    function loadUsers(page){
        const ps = Math.floor((contentDiv.current.offsetHeight - 40) / 40);
        setIsProgress(true);
        setActivePage(page - 1);
        callApi("GET", apibaseurl + "/authservice/getallusers/" + page + "/" + 2, null, null, loadData, token);
    }

    function loadData(res){
        setData(res);
        setIsProgress(false);
    }

    return (
        <div className='umanager'>
            <div className='umanager-header'>
                <label>User Manager</label>
            </div>
            <div className='umanager-content' ref={contentDiv}>
                <table>
                    <thead>
                        <tr>
                            <th style={{'width':'50px'}}>S#</th>
                            <th style={{'width':'250px'}}>Full Name</th>
                            <th style={{'width':'150px'}}>Phone Number</th>
                            <th style={{'width':'250px'}}>Registered Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    {data?.users.map((user, index)=>(
                        <tr key={user.id}>
                            <td style={{'text-align':'center'}}>{((data.page - 1) * data.size) + (index + 1)}</td>
                            <td>{user.fullname}</td>
                            <td style={{'text-align':'center'}}>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>
                                <img src={imgurl + "edit.png"} alt='' />
                                <img src={imgurl + "delete.png"} alt='' />
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
            <div className='umanager-footer'>
                <button>Add New</button>
                <div className='pages'>{
                    Array.from({ length: data?.totalpages}, (_, index) => (
                        <label key={index} className={index == activePage? 'active': ''} onClick={()=>loadUsers(index + 1)}>
                            {index + 1}
                        </label>
                    ))
                }</div>
            </div>

            <ProgressBar isProgress={isProgress}/>
        </div>
    );
}

export default UserManager;
