import Link from 'next/link';

export default function LinkBtn({ children, ...rest }) {
  return (
    <Link href={''} {...rest} passHref style={{ color: 'blue' }}>
      {children}
    </Link>
  );
}
