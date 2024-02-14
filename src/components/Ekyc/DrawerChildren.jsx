import { IconClose } from '../../assets/icons';

export default function DrawerChildren() {
  return (
    <div>
      <div>
        <p>Select verification method</p>
        <button onClick={() => alert(false)}>
          <IconClose />
        </button>
      </div>
    </div>
  );
}
