import React from 'react';
import { Container, Card, CardColumns, Button, ProgressBar, Navbar } from 'react-bootstrap';

class App extends React.Component {
	state = {
		data: [],
		done:  0,
		total: 10,
		progress: 0, // 0 to 100, based on done/total
		loading: true
	}

	componentDidMount() {
		let currentComponent = this;
		let url = "https://en.wikipedia.org/api/rest_v1/page/random/summary";
		Promise.all(
			Array.from({ length: this.state.total }, () => {
				return (
					fetch(url)
						.then(response => {
							if (response.ok) {
								this.updateProgress();
								return response.json();
							}
						})
				)
			})
		).then(function (data) {
			currentComponent.setState({
				data: data,
				loading: false
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	updateProgress = () => {
		this.setState(
			prevState => ({ done: prevState.done +1 }),
		);
		this.setState({
			progress: (this.state.done / this.state.total) * 100
		});
	}

	render() {
		return (
			this.state.loading ? (
				<ProgressBar now={this.state.progress} />
			) : (
				<Container fluid>
					<MyNavbar />
					<CardColumns>
						<CardCollection data={this.state.data} />
					</CardColumns>
				</Container>
			)
		);
	}
}

const CardCollection = (props) => {
	const cards = props.data.map((details) => {
		return (
			<MyCard data={details} />
		)
	});
	return cards;
}

class MyCard extends React.Component {
	render() {
		const data = this.props.data;
		let title = (data || {}).title;
		let extract = (data || {}).extract;
		let url = (((data || {}).content_urls || {}).desktop || {}).page;

		return (
			<Card>
				<Card.Body>
					<Card.Title>{title}</Card.Title>
					<Card.Text>{extract}</Card.Text>
					<Button href={url} target="_blank">Go to article</Button>
				</Card.Body>
			</Card>
		);
	}
}

const MyNavbar = (props) => {
	return (
		<Navbar bg="primary" variant="dark">
			<Navbar.Brand>10 Random Wikipedia Articles</Navbar.Brand>
		</Navbar>
	);
}

export default App