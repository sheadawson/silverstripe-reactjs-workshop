import React from 'react';

class SortComponent extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        var options = this.props.options.map((option, i) => {
            return (
                <option key={i}>{option}</option>
            );
        });

        return (
            <div className='sort-component'>
                <select onChange={this.handleChange} value={this.props.value}>
                    {options}
                </select>
            </div>
        );
    }

    handleChange(event) {
        this.props.updateSortOrder(event.target.value);
    }
}

SortComponent.propTypes = {
    options: React.PropTypes.array.isRequired,
    value: React.PropTypes.string.isRequired,
    updateSortOrder: React.PropTypes.func.isRequired
}

export default SortComponent;
