import './GenerateTILModal.scss';

const GenerateTILModal = () => {
  return (
    <div className="generate-modal">
      <div className="generate-modal__overlay" />
      <div className="generate-modal__content">
        <p className="generate-modal__text">
          <span className="generate-modal__spinner" />
          TIL 생성중...
        </p>
      </div>
    </div>
  );
};

export default GenerateTILModal;
