export const SimulationPage = ({ match }) => (
  <div className="container my-4">
    <h1 className="text-center mb-4">Simulation {match.params.id}</h1>
    <div className="mb-4 card">Here goes the sylvereye thing</div>
    <div className="row mb-4 gap-4 w-100 mx-auto">
      <div className="col card">
        a<br />1 a<br />1
      </div>
      <div className="col card">
        b<br />1 b<br />1
      </div>
      <div className="col card">
        c<br />1 c<br />1
      </div>
    </div>
    <div>
      <div>
        <b>Date: </b>April 10, 2020
      </div>
      <div>
        <b>Tags: </b>tag1 tag2 tag3
      </div>
      <div>
        <b>Location: </b>Helsinki, Finland
      </div>
      <div>
        <b>Time: </b>00:00 UTC
      </div>
      <div>
        <b>Extra: </b>a b c
      </div>
    </div>
  </div>
);
