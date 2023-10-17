const fetch = require("node-fetch");
const express = require("express");
const https = require("https");
const app = express();

let data;

app.get("/", (request, res) =>{
    fetch("https://mocki.io/v1/8c55801b-dc75-4cf9-a55a-dd8ae513e4bc", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => response.json())
    .then(response => { 
        const data = JSON.parse(JSON.stringify(response));
        let parsed_data = {
            "rows" : {
                "rowCount" : data.length,
                "rows" : [],
                "title" : "Posts",
                "totalRows" : data.length
            }
        };
        for(let i = 0; i<data.length; i++)
        {
            let column = {
                "columns" : [],
            }

            let obj = {}

            for(let key in data[i])
            {
                let str = key.toString().split(" ").join("");
                obj[str] = data[i][key];
            }
            column.columns.push(obj);
            parsed_data.rows.rows.push(column);
        }

        data.rows = parsed_data.rows;

        for(let i=0;i<data.rows.rows.length;i++)
        {
            if(data.rows.rows[i].columns.length === 0)
            {
                console.log("CAUGHT !!");
                data.rows.rows.splice(i,1);
            }
        }

        // Annotations for JSON Exporter
        /* JSON_EXPORTER_START */
        // console.log(JSON.stringify(data)); // Output for JSON Exporter
        /* JSON_EXPORTER_END */

        res.json(data);
    });
});

app.listen(8080, () => {
    console.log("Listen on the port 8080...");
});
