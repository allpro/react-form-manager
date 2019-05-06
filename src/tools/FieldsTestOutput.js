import React from 'react'
import PropTypes from 'prop-types'
// import isDate from 'lodash/isDate'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'


// THESE ARE JUST DEMO HELPERS - not needed in a real form
const getFieldName = f => f.aliasName || f.name
const getDisplayName = f => f.displayName || f.aliasName || f.name
const getInputType = field => {
	const inputType = field.inputType
	if (inputType) {
		return inputType === 'datetime' ? 'datetime-local' : inputType
	}

	const type = field.dataType
	const v = field.validation || {}

	if (/(string)/.test(type)) return 'text'
	if (/(boolean)/.test(type)) return 'checkbox'
	if (/(number|integer)/.test(type) || v.number || v.integer) return 'number'
	if (/datetime/.test(type) || v.datetime) return 'datetime-local'
	if (/date/.test(type) || v.date) return 'date'
	if (/time/.test(type) || v.time) return 'time'
	if (v.email) return 'email'
	if (v.password) return 'password'
	return 'text'
}


const helperTextStyles = {
	root: {
		whiteSpace: 'pre-line', // Puts each error-message on its own line
		lineHeight: '1.3em',
		display: 'none' // Hide blocks when not in error-state
	},
	error: {
		display: 'block'
	}
}


/**
 * Sample output of fields to validate form config
 */
class FieldsTestOutput extends React.Component {
	constructor( props ) {
		super(props)

		this.focusField = React.createRef()
	}

	componentDidMount() {
		// Auto-focus a field on-mount, if one passed in props
		const elem = this.focusField.current
		if (elem) elem.focus()
	}

	render() {
		const { props } = this
		const { form, classes } = props

		const formFields = form.getFieldConfig()
		// Transform hash to array for easy looping below
		// NOTE: Object.values() is not as supported as Object.keys()
		const arrFields = Object.keys(formFields).map(
			fieldName => formFields[fieldName]
		)

		const style = {
			border: '1px solid #CCC',
			borderRadius: '4px',
			margin: '24px',
			padding: '16px'
		}
		if (props.style) {
			Object.assign(style, props.style)
		}

		return (
			<section style={style}>
				<Typography variant="title">
					Autogenerated Field Output
					<span className="field-required-mark" />
				</Typography>

				<Typography paragraph className="form-tip">
					This tool can be used to verify data, field-configuration
					and validation options.
				</Typography>

				<section>
					<Button
						color="primary"
						variant="contained"
						style={{ margin: '10px 0 10px 10px' }}
						onClick={form.validateAll}
					>
						Validate All
					</Button>

					<Button
						color="secondary"
						variant="contained"
						style={{ margin: '10px 0 10px 10px' }}
						onClick={form.reset}
					>
						Reset Form
					</Button>
				</section>
				<hr />

				{arrFields.map((field) => {
					const aliasName = getFieldName(field)
					const displayName = getDisplayName(field)
					const inputType = getInputType(field)
					const ref = aliasName === props.focus
						? this.focusField
						: null

					// NEVER set a value to Null or Undefined, because this
					const value = form.getValue(aliasName)

					if (inputType === 'checkbox') {
						return (
							<FormControl
								key={aliasName}
								fullWidth={true}
								margin="dense"
								error={form.hasErrors(aliasName)}
							>
								<FormControlLabel
									label={displayName}
									control={
										<Checkbox
											{...form.dataProps(
												aliasName,
												{ checkbox: true }
											)}
											color="primary"
											inputRef={ref}
										/>
									}
								/>
								<FormHelperText classes={classes}>
									{form.getErrors(aliasName)}
								</FormHelperText>
							</FormControl>
						)
					}
					else {
						return (
							<TextField
								key={aliasName}
								label={displayName}
								{...form.dataProps(aliasName)}
								{...form.errorProps(aliasName)}
								value={value}
								type={inputType}
								fullWidth={true}
								margin="dense"
								inputRef={ref}
								FormHelperTextProps={{ classes }}
							/>
						)
					}
				})}

				{props.submitForm && (
					<Typography paragraph className="form-tip">
						<Button color="primary" onClick={props.submitForm}>
							Save / Submit
						</Button>
					</Typography>
				)}
			</section>
		)
	}
}


const { func, string, object } = PropTypes

FieldsTestOutput.propTypes = {
	focus: string,
	submitForm: func,
	classes: object
}


export default withStyles(helperTextStyles)(FieldsTestOutput)