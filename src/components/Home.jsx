import React, {Component} from 'react';
import FileUpload from 'react-fileupload';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderErrorMessage(){
    if (!this.state.error) return null;

    return <div className={'alert alert-danger'}>{this.state.error}</div>
  }

  renderResultTable() {
    if (!this.state.data) return null;

    const columns = this.state.data.columns.map((c,i) => {
      return (<tr key={`col-${i}`}>
        <td>{c.name}</td>
        <td>{c.perc}%</td>
        <td>{c.uniquie}</td>
        <td>{c.colType}</td>
      </tr>);
    });

    return (<table className={'table'}>
      <thead>
        <tr>
          <th>Имя колонки</th>
          <th>Заполненность колонки непустыми значениями</th>
          <th>Кол-во уникальных значений</th>
          <th>Тип/Типы значений</th>
        </tr>
        {columns}
        <tr>
          <td>
            {`Общая информация о файле: ${this.state.data.columns.length} колонок, ${this.state.data.rows} рядов`}
          </td>
        </tr>
      </thead>

    </table>);
  }

  render() {
  	const options={
        baseUrl: '/upload',
        dataType: 'text/csv',
        accept: 'csv',
        chooseFile: (file) => {
          this.setState({file});
        },
        uploadSuccess: (res) => {
          if (res.error) this.setState({data: null, error: res.error});
          else this.setState({data: res, error: null});
        }
    }

    const uploadBtn = this.state.file ? <button className={'btn btn-primary'} ref='uploadBtn'>upload</button> : null;

    return (<div>
    	<h2>Upload a CSV file</h2>
    	<FileUpload options={options}>
    		<button className={'btn'} ref='chooseBtn'>{this.state.file ? 'chooose another' : 'choose'}</button>
    		{uploadBtn}
    	</FileUpload>
      <hr />
      {this.renderErrorMessage()}
      {this.renderResultTable()}
    </div>);
  }
}