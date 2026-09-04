"""
Shared connectivity probe helper for external data-source connectors.

`requests`' own `timeout` parameter does not reliably bound OS-level DNS
resolution on every platform (observed: a blocked/offline network can make a
single HEAD request hang far longer than its configured timeout on Windows).
Health checks must never let that stall a request, so the probe is run in a
worker thread with a hard wall-clock deadline enforced independently of
whatever the underlying socket call does.
"""

from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeoutError
import requests

_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="connectivity-probe")


def probe_reachable(url: str, timeout_sec: float = 1.5) -> bool:
    """
    Returns True if a HEAD request to `url` completes with a non-5xx status
    within `timeout_sec` wall-clock seconds, False otherwise (including on
    any network error or hang).
    """
    def _do_probe() -> bool:
        res = requests.head(url, timeout=timeout_sec)
        return res.status_code < 500

    future = _executor.submit(_do_probe)
    try:
        return future.result(timeout=timeout_sec)
    except (FutureTimeoutError, Exception):
        return False
