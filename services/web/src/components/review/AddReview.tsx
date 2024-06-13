'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';

const AddReview = ({ isModalOpen, handleCloseModal }) => {
  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <BaseUIModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Add New Review"
    >
      <div className="border-gray-400">
        <form onSubmit={handleSubmit}>
          <div className="pt-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-black text-sm font-normal"
              >
                First Name
              </label>
              {/* <TextInput
                name="firstName"
                value={firstName}
                onChange={(value) => setFirstName(value)}
                required
              /> */}
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="text-black text-sm font-normal"
              >
                Last Name
              </label>
              {/* <TextInput
                name="lastName"
                value={lastName}
                onChange={(value) => setLastName(value)}
                required
              /> */}
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
              <label
                htmlFor="referrerType"
                className="text-black text-sm font-normal"
              >
                Referrer Type
              </label>
              {/* <Select
                options={referrerTypeOptions}
                onChange={handlereferrerTypeChange}
                value={
                  referrerType
                    ? [{ label: referrerType, id: referrerType }]
                    : []
                }
                required
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      color: 'rgba(82, 82, 91, 1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                  },
                  ClearIcon: {
                    component: () => null,
                  },
                }}
              /> */}
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-black text-sm font-normal">
                Email
              </label>
              {/* <TextInput
                name="email"
                value={email}
                onChange={(value) => setEmail(value)}
              /> */}
            </div>
          </div>
          <div className="text-right text-base pt-4">
            {/* <Button kind="primary" title="Add new Referrer" width={189} /> */}
          </div>
        </form>
      </div>
    </BaseUIModal>
  );
};
export default AddReview;
