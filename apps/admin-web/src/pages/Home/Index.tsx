import React from "react"
import "./styles.css"
import { Link } from "react-router-dom"

const Home = () => {
	return (
		<div>
			<h1 className="title">Hello, it is home!</h1>
			<Link to="/dashboard/seniors">Seniors</Link>
			<Link to="/dashboard/administrator">Administrator</Link>
		</div>
	)
}

export default Home
