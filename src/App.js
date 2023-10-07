/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import React, { Component } from 'react'
import Globe from 'worldwind-react-globe'
import Chat from './components/Chat/index'
import './App.css'

export default class App extends Component {
  render() {

    const layers = [
      'usgs-topo',
      'stars',
    ];

    return (
			<div class="wrapper">
				<div class="container">
					<Chat />
					<div className='fullscreen'>
						<Globe 
							ref={this.globeRef}
							layers={layers}
							latitude={34.2}
							longitude={-119.2}
							altitude={10e6} 
						/>
					</div>
				</div> 
			</div>  
    )
  }
}