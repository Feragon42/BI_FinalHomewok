var nodes = [
  {
    'title' : 'Empresa con mayor estadia en el hotel',
    'url' : 'mayorEstadiaEmpresa'
  },
  {
    'title' : 'Estado con mayor indice de estadia',
    'url' : 'mayorEstadiaEstado'
  },
  {
    'title' : 'Mayor indice de consumo',
    'url' : 'porcentajeDeConsumo'
  },
  {
    'title' : 'Mayor indice de procedencia',
    'url' : 'porcentajeDeProcedencia'
  }
];

var StatsList = React.createClass({
  render: function(){
    return(
      <div className='statsList'>
        <StatsNode nodes={this.props.nodes} />
      </div>
    ); 
  }
});

var StatsNode = React.createClass({
  render: function(){
    var nodesInfo = this.props.nodes.map(function(data){
      return(
        <div>
          <h2>{data.title}</h2> 
          <StatsContent url={data.url} />
          <hr/>
        </div> 
      );
    });
    return(
      <div className='statsNode'>
        {nodesInfo}
      </div>
    );
  }
});

var StatsContent = React.createClass({
  loadStatsInfo: function(){
    $.ajax({
      url: '/querys/'+this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data})
      }.bind(this),
      error: function(data){
        console.log(data.responseText);
      }.bind(this)
    })
  },
  getInitialState: function(){
    return {data:[]}
  },
  componentDidMount: function(){
    this.loadStatsInfo();
  },
  render: function(){
    var url = this.props.url;
    var last = '';
    
    var statsInfo = this.state.data.map(function(info){
      var actual = info._id.enterprise;
      console.log('El anterior fue: '+last+' Y el nuevo es: '+actual);
      
      if(url=='mayorEstadiaEmpresa'){
        return(
          <div>
            <h4>{info._id} <label>{info.lodging_days} dias.</label></h4>
          </div>
        );
      }
      
      if(url=='mayorEstadiaEstado'){
        if(last!=actual){
          return(
            <div>
              <h3>{info._id.enterprise} <h4>{info._id.hotel_hq} <label>{info.lodging_days} dias.</label></h4></h3>
            </div>
          );
        }
        else{
          return(
            <div>
              <h4>{info._id.hotel_hq} <label>{info.lodging_days} dias.</label></h4>
            </div>
          );
        }
        
        
      }
      
      if(url=='porcentajeDeConsumo'){
        return(
          <div>
            <h4>{info._id} <label>{info.total_pay} Bsf.</label></h4>
          </div>
        );
      }
      
      if(url=='porcentajeDeProcedencia'){
        return(
          <div>
            <h4>{info._id} <label>{info.count} veces.</label></h4>
          </div>
        );
      }
      
      last = info._id.enterprise;
      
    });

    
    
    return(
      <div>
        {statsInfo}
      </div>
    );
  }
});

ReactDOM.render(
  <StatsList nodes={nodes}/>,
  document.getElementById("statistics")
);