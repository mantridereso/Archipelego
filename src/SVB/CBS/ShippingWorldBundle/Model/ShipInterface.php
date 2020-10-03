<?php
namespace SVB\CBS\ShippingWorldBundle\Model;
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 21.09.15
 * Time: 17:10
 */
interface ShipInterface
{

    /**
     * @return string
     */
    public function getName();

    /**
     * @return WorldInterface
     */
    public function getWorld();

    /**
     * @return TransportInterface[]
     */
    public function getCurrentTransport();

    /**
     * @return ShipperInterface
     */
    public function getShipper();

    /**
     * @return array
     */
    public function export();

    /**
     * @param \DateTime $dateTime
     * @return boolean
     */
    public function hasDeparted(\DateTime $dateTime);

    /**
     * @param \DateTime $dateTime
     * @return boolean
     */
    public function hasArrived(\DateTime $dateTime);

    /**
     * @param \DateTime $dateTime
     * @return array
     */
    public function exportState(\DateTime $dateTime);

}