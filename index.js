


<div className="container">
    <h1>
        Weather App
    </h1>
    <div className="searchContainer">
        <input
        className="inputField"
        id="cityField"
        placeholder="Enter city Name....."
        type="text"
        />
        <button id= "searchBtn"> Search </button>
    </div>
    <div id = "weatherContainer">
        <h2 id ="cityName "> </h2>
        <p id ="temperature"></p>
        <p id ="condition"></p>
        <p id ="windSpeed"></p>

    </div>
    <p id="errorMessage"></p>


</div>
<script src ="scripts.js"></script>
