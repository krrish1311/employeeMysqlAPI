const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const con = mysql.createConnection({
  host: "192.168.1.105",
  user: "krrish",
  password: "131120",
  database: "company",
});
con.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connection Successful");
  }
});

app.get("/Employees", (req, resp) => {
  con.query("select * from Employee", (err, result) => {
    if (err) {
      resp.send(err);
    } else {
      resp.send(result);
    }
  });
});

app.get("/Employees/:EmployeeInfo", (req, resp) => {
  let flag = true;
  let EmployeeInf = req.params.EmployeeInfo;
  for (let i = 0; i < EmployeeInf.length; i++) {
    let ascii = EmployeeInf[0].charCodeAt(0);
    if (!(ascii >= 48 && ascii <= 57)) {
      flag = false;
    }
  }
  if (flag) {
    const employid = parseInt(EmployeeInf);
    con.query("select * from Employee WHERE id=?", employid, (err, result) => {
      if (err) {
        resp.send(err);
      } else {
        resp.send(result);
      }
    });
  } else {
    const employname = EmployeeInf;
    con.query(
      "select * from Employee WHERE First_Name=?",
      employname,
      (err, result) => {
        if (err) {
          resp.send(err);
        } else {
          resp.send(result);
        }
      }
    );
  }
});

app.post("/Employees/addEmployee", (req, resp) => {
  const First_Name = req.body.First_Name;
  const Last_Name = req.body.Last_Name;
  const mobile = req.body.mobile;
  const designation = req.body.designation;
  con.query(
    "insert into Employee(First_Name,Last_Name,mobile,designation) value(?,?,?,?)",
    [First_Name, Last_Name, mobile, designation],
    (err) => {
      if (err) {
        resp.send(err);
      } else {
        resp.send("The Employee Data has been added");
      }
    }
  );
});

app.put("/Employees/update/:id", (req, resp) => {
  const employid = req.params.id;
  const First_Name = req.body.First_Name;
  const Last_Name = req.body.Last_Name;
  const mobile = req.body.mobile;
  const designation = req.body.designation;
  con.query(
    "update  Employee set First_Name=?,Last_Name=?,mobile=?,designation=? WHERE id=?",
    [First_Name, Last_Name, mobile, designation, employid],
    (err, result) => {
      if (err) {
        resp.send(err);
      } else {
        resp.send("The Employee Data has been updated");
      }
    }
  );
});

app.delete("/Employees/delete/:id", (req, resp) => {
  const employid = req.params.id;
  con.query("DELETE from Employee WHERE id=?", employid, (err, result) => {
    if (err) {
      resp.send(err);
    } else {
      resp.send("the data has been deleted");
    }
  });
});

app.listen(8520);
