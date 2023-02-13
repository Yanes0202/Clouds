import "./Team.css";

function Team({id,userCount}) {

    return (
        <div className="team">
            <h3>{id}</h3>
            <p>Users total: {userCount}</p>
        </div>
    );

}


export default Team