const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require("../models");
const Employee = db.employee;
const fs = require("fs"),
      csv = require("csv-parser");

router.post("/apiemp_insert", 
	check('empno').notEmpty().withMessage('EmpNo is required'),
	check('empname').notEmpty().withMessage('Name is required'),
	check('empdob').notEmpty().withMessage('Date of Birth is required'),
	check('joindate').notEmpty().withMessage('Join Date is required'),
	check('departmentId').notEmpty().withMessage('departmentId is required'),
	check('salary').notEmpty().withMessage('salary is required'),
	check('skill').notEmpty().withMessage('skill is required'),
	function (req, res) {	
	console.log(req.body)
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	Employee.findOne({ where : { empNo : req.body.empno } }).then(res2 => {
		if (res2 != null) {
			return res.status(400).json({ errors: [{msg : 'EmpNo duplicated'}] });
		} else {
			console.log(req.body.skill)
			console.log(JSON.stringify(req.body.skill))
			const employee = {
				empNo : req.body.empno,
				empName : req.body.empname,
				empDob : req.body.empdob,
				joinDate : req.body.joindate,
				departmentId : req.body.departmentId,
				salary : req.body.salary,
				skills : JSON.stringify(req.body.skill)
			};

			Employee.create(employee).then(data => {
				return res.json({ success : true, message : 'Employee Created!', data : data });
			}).catch(err => {
				console.log(err);
				return res.status(500).json({ success : false, message : err });
			})	
		}
	})
			
});

router.get("/apiemp_select", function (req, res) {	
	const limit = (req.query.limit)? req.query.limit : 10
	const offset = (req.query.offset)? req.query.offset : 0
	Employee.findAll({ 
		include : [db.department],
		limit : parseInt(limit),
		offset : parseInt(offset)
	}).then(async data => {
		const count = await Employee.count();
		return res.json({ success : true, data : data, count : count });
	}).catch(err => {
		return res.status(500).json({ success : false, error : err });
	});
});

router.get("/apiemp_selectbyempid/:emp_id", function (req, res) {	
	Employee.findOne({ 
		where : { id : req.params.emp_id }
	}).then(data => {
		return res.json({ success : true, data : data });
	}).catch(err => {
		return res.status(500).json({ success : false, error : err });
	});
});

router.get("/apidep_select", function (req, res) {	
	db.department.findAll().then(data => {
		return res.json({ success : true, data : data });
	}).catch(err => {
		return res.status(500).json({ success : false, error : err });
	});
});

router.put("/apiemp_update/:emp_id", 
	check('empId').notEmpty().withMessage('EmpId is required'),
	check('empname').notEmpty().withMessage('Name is required'),
	check('empdob').notEmpty().withMessage('Date of Birth is required'),
	check('joindate').notEmpty().withMessage('Join Date is required'),
	check('departmentId').notEmpty().withMessage('departmentId is required'),
	check('salary').notEmpty().withMessage('salary is required'),
	check('skill').notEmpty().withMessage('skill is required'),
	async function (req, res) {	
	
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const employee = {
		empName : req.body.empname,
		empDob : req.body.empdob,
		joinDate : req.body.joindate,
		departmentId : req.body.departmentId,
		salary : req.body.salary,
		skill : JSON.parse(req.body.skill)
	};

	Employee.update(employee, {
		where : {
			id : req.params.emp_id
		}
	}).then(data => {
		return res.json({ success : true, message : 'Employee Updated!', data : data });
	}).catch(err => {
		console.log(err);
		return res.status(500).json({ success : false, message : err });
	})			
});

router.delete("/apiemp_delete/:emp_id", function (req, res) {
	const id = req.params.emp_id
	Employee.delete(id).then(res => {
		return res.json({ success : true, message : 'Employee Deleted!' })
	}).catch(err => {
		console.log(err)
		return res.json({ success : false })
	})
})

router.post("/apicsv_upload", async function (req, res) {
	if (req.files) {
		const filename = 'csv-'+new Date().getTime()
		const fileDir = './uploads/'+filename+'.csv'
		await req.files.csv.mv(fileDir);
 
		var results = [];
		fs.createReadStream(fileDir)
		.pipe(csv())
		.on("data", (data) => results.push(data))
		.on("end", () => {
			console.log('end')
			console.log(results);
			Employee.bulkCreate(results).then(res2 => {
				return res.json({ success : true })
			})
		});
	}
})


// router.post("/chart", 
// 	check('name').notEmpty().withMessage('name is required'),
// 	check('age').notEmpty().withMessage('age is required').isInt().withMessage('age must be numeric'),
// 	check('gender').notEmpty().withMessage('gender is required').isIn(['M', 'F']).withMessage('gender should be M or F'),
// 	function (req, res) {	
	
// 	const errors = validationResult(req)
// 	if (!errors.isEmpty()) {
// 		return res.status(400).json({ errors: errors.array() });
// 	}

// 	const user = {
// 		name : req.body.name,
// 		age : req.body.age,
// 		gender : req.body.gender
// 	};

// 	Chart.create(user).then(data => {
// 		return res.json({ success : true, message : 'User Created!', data : data });
// 	}).catch(err => {
// 		console.log(err);
// 		return res.status(500).json({ success : false, message : err });
// 	})			
// });

// router.get("/chart", function (req, res) {	
// 	/* Task 3 – Demonstrate the use of .then() and async/await in your code.
// 		 Explain in your comment the impact of using async/await as compared to .then(),
// 		 and the use case for each approach. */
// 	/* ANS: Here I used .then() . In a single transition like this we can easily use .then() without problem or complication */
// 	Chart.findAll().then(data => {
// 		return res.json({ success : true, data : data });
// 	}).catch(err => {
// 		return res.status(500).json({ success : false, error : err });
// 	});
// });

// router.get("/bar", async function (req, res) {
// 	/* Task 3 – Demonstrate the use of .then() and async/await in your code.
// 		 Explain in your comment the impact of using async/await as compared to .then(), 
// 		 and the use case for each approach. */
// 	/* ANS: Here I used async/await rather then .then() . 
// 		 By using saync/await it will pause the function execution until the promise is done. 
// 		 By using .then() the codes under .then() will execute without waiting .then() function. So, it will make the waterfall .then() callback hell and will complicate when we are working with a lot of transition */
// 	try {		 
// 		const datas = await Chart.findAll() // by looking at this code, we can only do next transition after getting datas
// 		const youngAdult = datas.filter(data => data.age >= 0 && data.age <= 35).length
// 		const adult = datas.filter(data => data.age >= 36 && data.age <= 50).length
// 		const seniors = datas.filter(data => data.age > 50).length		
// 		return res.json({ success : true, data : {
// 			youngAdult, adult, seniors
// 		} });
// 	} catch (err) { // as you can see here error handling is way better with 1 try catch slot
// 		return res.status(500).json({ success : false, error : err });
// 	}
// })

// router.get("/pie", async function (req, res) {	
// 	try {		 
// 		const datas = await Chart.findAll()
// 		const noOfMale = datas.filter(data => data.gender === 'M').length
//   	const noOfFemale = datas.filter(data => data.gender === 'F').length	
// 		return res.json({ success : true, data : {
// 			noOfMale, noOfFemale
// 		} });
// 	} catch (err) {
// 		return res.status(500).json({ success : false, error : err });
// 	}
// })

module.exports = router;
