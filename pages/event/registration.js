import Registration from "../../foundations/rigestration/Registration";

export default function Page() {
  return <Registration />
}

export async function getServerSideProps(context) {

//省略

return {
    props:  {}
  };
}
